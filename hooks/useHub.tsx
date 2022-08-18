import { useQuery } from "@tanstack/react-query";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { chain_details } from "modules/constants";
import { encodeBase64 } from "modules/util/conversion";
//import axios from "axios";

export type UnbondRequestParsed = {
  status: "pending" | "unbonding" | "completed";
  amount: number; // means `usteak` amount if the batch has not been submitted, or `uluna` if already submitted
  startTime: Date;
  finishTime: Date;
  batchIsReconciled: boolean;
};

export type UnbondRequestsByUserResponseItem = {
  id: number;
  shares: string;
};
export type PendingBatchResponse = {
  id: number;
  usteak_to_burn: number;
  est_unbond_start_time: number
};
export type PreviousBatchResponse = {
  id: number;
  reconciled: boolean;
  total_shares: number;
  amount_unclaimed: number;
  est_unbond_end_time: number
};
export type PreviousBatchResponseUser = {
  id: number;
  reconciled: boolean;
  shares: number
  total_shares: number;
  amount_unclaimed: number;
  est_unbond_end_time: number
  status: "pending" | "unbonding" | "completed";
  amount: number; // means `usteak` amount if the batch has not been submitted, or `uluna` if already submitted
};

//export type UnbondRequestsByUserResponse = UnbondRequestsByUserResponseItem[];


interface useHubArgs {
  client: CosmWasmClient | null;
  hub: string;
}

interface useChainDetailsArgs {
  client: CosmWasmClient | null;
  network: chain_details;
}

interface useUnbondRequestsArgs extends useHubArgs {
  address: string;
}

interface usePreviousBatchArgs extends useHubArgs {
  id: number;
}


export const useUnbondRequests = ({ client, hub, address }: useUnbondRequestsArgs) => {

  return useQuery(["unbond_requests_user", hub, address], () => {
    if (address == null || client == null || hub == null) {
      throw new Error("Error in fetching unbond requests");
    }
    return client.queryContractSmart(hub, { unbond_requests_by_user: { user: address } });

  });
};
export const useUnbondRequestsHydrated = ({ client, hub, address }: useUnbondRequestsArgs) => {

  return useQuery(["unbond_requests_user_hydrated", hub, address], () => {
    if (address == null || client == null || hub == null) {
      throw new Error("Error in fetching unbond requests hydrated");
    }
    const currentTime = new Date();
    return client.queryContractSmart(hub, { unbond_requests_by_user: { user: address } }).then(urbu => {
      return client.queryContractSmart(hub, { pending_batch: {} }).then((pending: PendingBatchResponse) => {
        const batch_promises = urbu.filter((ur: UnbondRequestsByUserResponseItem) => ur.id != pending.id).map((ur: UnbondRequestsByUserResponseItem) => {
          return client.queryContractSmart(hub, { previous_batch: ur.id }).then((pb: PreviousBatchResponse) => {
            const finishTime = new Date(pb.est_unbond_end_time * 1000);
            return {
              id: pb.id,
              shares: ur.shares,
              reconciled: pb.reconciled,
              total_shares: pb.total_shares,
              amount_unclaimed: pb.amount_unclaimed,
              est_unbond_end_time: pb.est_unbond_end_time,
              amount:
                (Number(pb.amount_unclaimed) * Number(ur.shares)) /
                Number(pb.total_shares),
              status: currentTime < finishTime ? "unbonding" : "completed"
            };
          });
        });
        return Promise.all(batch_promises).then((pb: PreviousBatchResponseUser[]) => {
          //console.log('prev batch',pb);
          return pb;
        });
      });
    });
  });
};

export const useHubState = ({ client, hub }: useHubArgs) => {

  return useQuery(["state", hub], () => {
    if (client == null || hub == null) {
      throw new Error("Error in fetching state ");
    }
    return client.queryContractSmart(hub, { state: {} });

  });
};

export const usePendingBatch = ({ client, hub }: useHubArgs) => {

  return useQuery(["pending_batch", hub], () => {
    if (client == null || hub == null) {
      console.log("usePendingBatch client", client, "hub", hub);
      throw new Error("Error in fetching usePendingBatch");
    }

    return client.queryContractSmart(hub, { pending_batch: {} });
  });
};

export const usePreviousBatch = ({ client, hub, id }: usePreviousBatchArgs) => {

  const data = useQuery(["previous_batch", hub, id], () => {
    if (client == null || hub == null) {
      throw new Error("Error in fetching previous_batch");
    }

    return client.queryContractSmart(hub, { previous_batch: id });
  });


  return data;
};

export const useConfig = ({ client, hub }: useHubArgs) => {

  const data = useQuery(["config", hub], () => {
    if (client == null || hub == null) {
      throw new Error("Error in fetching previous_batch");
    }

    return client.queryContractSmart(hub, { config: {} });
  });

  return data;
};

export type ContractStoreResponse<T> = {
  query_result: T;
};
export type MultiqueryResponse = {
  success: boolean;
  data: string;
}[];

export const useGlobal = ({ network, client }: useChainDetailsArgs) => {

  const data = useQuery(["global", network.multiquery, network.hub], () => {
    if (client == null || network == null) {
      throw new Error("Error in fetching global");
    }
    const config = { config: {} };
    const state = { state: {} };
    const pending = { pending: {} };
    const queries = {
      aggregate: {
        queries: [
          {
            address: network.hub,
            data: encodeBase64(config)
          }, {
            address: network.hub,
            data: encodeBase64(state)
          }, {
            address: network.hub,
            data: encodeBase64(pending)
          }]

      }
    };

  //  console.log("calling. MC");
    return client.queryContractSmart(network.multicall, queries);
    // return axios.get<ContractStoreResponse<MultiqueryResponse>>(`${network.api}/cosmwasm/wasm/v1/contract/${network.multiquery}/smart/${encodeBase64(queries)}`)
  });
  return data;

};

