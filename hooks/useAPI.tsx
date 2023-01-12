import { useQuery } from "@tanstack/react-query";
import axios from "axios";


interface useAPIArgs {
  api: string;
}


//import axios from "axios";
/**
 * Response of GRPC Gateway `/cosmos/staking/v1beta1/validators` API, with pagination parameters omitted
 */
export interface Validator {
  operator_address: string;
  consensus_pubkey: {
    "@type": string;
    key: string;
  };
  jailed: boolean;
  status: "BOND_STATUS_BONDED" | "BOND_STATUS_UNBONDING" | "BOND_STATUS_UNBONDED";
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
    update_time: string;
  };
  min_self_delegation: string;
}
export interface ValidatorsResponse {
  validators: Validator[];
}

export const useValidators = ({ api }: useAPIArgs) => {

  return useQuery(["validators", api], () => {
    if ( api == null) {
      console.log("useValidators api", api);
      throw new Error("Error in fetching usePendingBatch");
    }
    return  axios.get<ValidatorsResponse>(
        `${api}/cosmos/staking/v1beta1/validators?pagination.limit=250`
    ).then (response => response.data);

  });
};
