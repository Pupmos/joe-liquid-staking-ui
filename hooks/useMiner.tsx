import {
  CosmWasmClient,
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@wizard-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import init, { mine, MinedProof } from "dpow-browser-miner";
import { useMutation } from '@tanstack/react-query';

const localNonceStorage = {
  get: () => {
    const nonce = localStorage.getItem("nonce");
    if (nonce) {
      return BigInt(nonce);
    }
    return BigInt(0);
  },
  set: (nonce: bigint) => {
    localStorage.setItem("nonce", nonce.toString());
  },
};

const MAX_NONCE = BigInt("18_446_744_073_709_551_615".replaceAll("_", ""));

type SubmittedProofContext = {
  proof: MinedProof;
  tx: ExecuteResult
}
type MinerClientState = {
  client: CosmWasmClient;
  address: string;
  hub: string;
  signingClient: SigningCosmWasmClient;
  onMinedBatch?: (proof: MinedProof) => void;
  onMinerParams?: (params: { difficulty: bigint; entropy: string }) => void;
  onSubmitProof?: (context: SubmittedProofContext) => void;
};
class Miner {
  private clientState?: MinerClientState;
  private nonce = BigInt(0);
  private _nextTick: Promise<void>;
  private start: ((...args: any[]) => void) | undefined;
  private hasStarted = false;
  private lastMinedProof: MinedProof | undefined;
  private hasInitialized = false;
  private validator: string | undefined;
  minerParams: {
    difficulty: bigint;
    entropy: string;
  } = { difficulty: BigInt(0), entropy: "0" };
  constructor() {
    this._nextTick = this.createTick();
  }

  setNonce(nonce: bigint) {
    this.nonce = nonce;
  }

  setValidator(validator: string) {
    this.validator = validator;
  }

  setClientState(clientState: MinerClientState) {
    this.clientState = clientState;
  }

  startMining() {
    this.hasStarted = true;
    this.start?.();
  }

  stopMining() {
    this.resetNextTick();
  }

  async updateMinerEntropy() {
    if (!this.clientState) {
      throw new Error("No client state");
    }
    // random bytes string from browser crypto 
    const entropy = await crypto.getRandomValues(new Uint8Array(32)).reduce(
      (acc, val) => acc + val.toString(16).padStart(2, "0"),
      "",
    );

    await this.clientState.signingClient?.execute(
      this.clientState.address,
      this.clientState.hub,
      {
        update_entropy: {
          entropy
        },
      },
      {
        gas: "2000000",
        amount: [{ denom: "ujoe", amount: "10000000" }],
      },
    ).then((tx) => {
      console.table(tx)
    }).catch((e) => {
      console.error(e);
    });
  }

  private async *minerLoop() {
    while (true) {
      // await next animation frame 
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await this.nextTick();
      yield true;
    }
  }

  private resetNextTick() {
    if (!this.hasStarted) {
      return;
    }
    this.hasStarted = false;
    this._nextTick = this.createTick();
  }

  private createTick() {
    return new Promise<void>((resolve) => {
      this.start = resolve;
    });
  }

  private nextTick() {
    return this._nextTick;
  }

  private async pollForMinerParams() {
    return new Promise<void>(async (resolve) => {
      for await (const _ of this.minerLoop()) {
        try {
          if (this.clientState) {
            const data = await this.clientState.client.queryContractSmart(
              this.clientState.hub,
              {
                miner_params: {},
              },
            );
            if (this.minerParams.entropy === "0") {
              resolve(data);
            }
            this.minerParams = {
              difficulty: BigInt(data.difficulty),
              entropy: data.entropy,
            };
            this.clientState?.onMinerParams?.(this.minerParams);
          }
        } catch (e) {
          console.error(e);
        }
        // wait for next block
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    });
  }
  runMiningBatch() {
    if (!this.clientState) {
      throw new Error("No client state");
    }
    const { nonce, success, hash } = mine(
      this.minerParams.entropy,
      this.clientState.address,
      BigInt(this.minerParams.difficulty),
      this.nonce,
      BigInt("1000"),
    );
    this.lastMinedProof = {
      nonce,
      success,
      hash,
    } as MinedProof;
    this.nonce = this.lastMinedProof.nonce + BigInt(1);
    this.clientState?.onMinedBatch?.(this.lastMinedProof);
    return this.lastMinedProof;
  }

  private async submitValidProof(minedProof: MinedProof, validator: string) {
    if (!minedProof.success) {
      throw new Error("Proof is not valid");
    }
    if (!this.clientState) {
      throw new Error("No client state");
    }
    await this.clientState.signingClient?.execute(
      this.clientState.address,
      this.clientState.hub,
      {
        submit_proof: {
          nonce: minedProof?.nonce.toString(),
          validator
        },
      },
      {
        gas: "2000000",
        amount: [{ denom: "ujoe", amount: "10000000" }],
      },
    ).then((tx) => {
      this.clientState?.onSubmitProof?.({
        proof: minedProof,
        tx
      });
      return tx;
    }).catch((e) => {
      console.error(e);
      this.clientState?.onSubmitProof?.({
        proof: minedProof,
        tx: e
      });
    });
  }
  private async pollForClientState() {
    return new Promise<void>(async (resolve) => {
      while (true) {
        if (this.clientState) {
          resolve();
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    });
  }

  async init() {
    if (this.hasInitialized) {
      return;
    }
    this.hasInitialized = true;
    init().then(async () => {
      console.log("initialized");
      await this.pollForMinerParams();
      console.log('miner params loaded')
      if (!this.validator) {
        throw new Error("No validator set");
      }
      for await (const _ of this.minerLoop()) {
        if (this.nonce > MAX_NONCE) {
          this.nonce = BigInt(0);
        }
        await this.pollForClientState();
        const minedProof = this.runMiningBatch();
        if (minedProof?.success) {
          await this.submitValidProof(minedProof, this.validator)
            .then(console.log)
            .catch(console.error);
        }
      }
    });
  }
}

const miner = new Miner();


export const useMiner = (hub: string, validator: string | undefined) => {
  const { client, address, signingClient } = useWallet();
  const [minerStatus, setMinerStatus] = useState<"running" | "stopped">(
    "stopped",
  );
  const [currentMinedProof, setCurrentMinedProof] = useState<MinedProof | null>(
    null,
  );
  const [currentSubmittedProof, setCurrentSubmittedProof] = useState<SubmittedProofContext | null>(null);
  const [currentMinerParams, setCurrentMinerParams] = useState<{
    entropy: string;
    difficulty: bigint;
  } | null>(null);

  const startMiner = useCallback(() => {
    setMinerStatus("running");
    miner.startMining();
  }, []);
  const stopMiner = useCallback(() => {
    setMinerStatus("stopped");
    miner.stopMining();
  }, []);
  const updateEntropyMutation = useMutation(() => miner.updateMinerEntropy());
  useEffect(() => {
    miner.init();
    if (client && address && hub && signingClient && validator) {
      miner.setValidator(validator)
      miner.setNonce(localNonceStorage.get())
      if (minerStatus === "running") {
        miner.startMining();
      }
      miner.setClientState({
        client,
        address,
        hub,
        signingClient,
        onMinedBatch: (proof) => {
          setCurrentMinedProof(proof);
          localNonceStorage.set(proof.nonce);
        },
        onMinerParams: setCurrentMinerParams,
        onSubmitProof: setCurrentSubmittedProof
      });
      return () => {
        miner.stopMining();
        miner.setClientState({
          client,
          address,
          hub,
          signingClient,
          onMinedBatch: undefined,
          onMinerParams: undefined,
        });
      };
    }
  }, [client, address, hub, signingClient, validator]);

  return {
    startMiner,
    stopMiner,
    minerStatus,
    currentMinedProof,
    currentMinerParams,
    currentSubmittedProof,
    MAX_NONCE,
    updateEntropyMutation
  };
};
