import { useWallet } from "@wizard-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import init, { mine, MinedProof } from "wasm-miner";

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
export const useMiner = (hub: string) => {
  const { client, address, signingClient } = useWallet();
  const [minerStatus, setMinerStatus] = useState<"running" | "stopped">(
    "stopped",
  );
  const [currentMinedProof, setCurrentMinedProof] = useState<MinedProof | null>(
    null,
  );
  const mineLoop = useMemo(
    async function* mineLoop() {
      if (minerStatus === "stopped") {
        return;
      }
      while (true) {
        yield true;
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    },
    [minerStatus],
  );
  const startMiner = useCallback(() => {
    setMinerStatus("running");
  }, []);
  const stopMiner = useCallback(() => {
    setMinerStatus("stopped");
    mineLoop.throw("miner stopped");
  }, []);
  useEffect(() => {
    init().then(async () => {
      for await (const _ of mineLoop) {
        if (!client) return;
        console.log("mining");
        if (address === null) return;

        let entropy = "0";
        let difficulty = "1";

        await new Promise(async (resolve) => {
          for await (const _ of mineLoop) {
            const data = await client.queryContractSmart(hub, {
              miner_params: {},
            });
            if (entropy === "0") {
              resolve(data);
            }
            entropy = data.entropy;
            difficulty = data.difficulty;
            // wait for next block
            await new Promise((resolve) => setTimeout(resolve, 8000));
          }
        });

        let nonce = localNonceStorage.get();
        let minedProof: MinedProof | undefined = undefined;
        const MAX_NONCE = BigInt(
          "18_446_744_073_709_551_615".replaceAll("_", ""),
        );
        for await (const _ of mineLoop) {
          if (nonce > MAX_NONCE) {
            nonce = BigInt(0);
            break;
          }
          minedProof = mine(
            entropy,
            address,
            BigInt(difficulty),
            nonce,
            BigInt("100000"),
          );
          nonce = minedProof.nonce + BigInt(1);
          localNonceStorage.set(nonce);
          setCurrentMinedProof(minedProof);
          console.log("mining...", nonce);
        }
        console.log("mined: ", minedProof?.nonce);
        console.table({
          entropy,
          difficulty,
          nonce: minedProof?.nonce,
          hash: minedProof?.hash,
        });

        if (minedProof?.success) {
          await signingClient
            ?.execute(
              address,
              hub,
              {
                submit_proof: {
                  nonce: minedProof?.nonce.toString(),
                },
              },
              {
                gas: "2000000",
                amount: [{ denom: "ujoe", amount: "10000000" }],
              },
            )
            .then(console.log)
            .catch(console.error);
        }
      }
    });
    return () => {
      mineLoop.throw("miner stopped");
    };
  }, [minerStatus]);
  return {
    startMiner,
    stopMiner,
    minerStatus,
    currentMinedProof,
  };
};
