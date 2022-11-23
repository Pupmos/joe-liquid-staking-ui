import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@wizard-ui/react";

export type BalanceResponse = {
  balance: string;
};

function isBalanceResponse(value: BalanceResponse): value is BalanceResponse {
  return value.hasOwnProperty("balance");
}

interface UseBalanceArgs {
  token: string;
  address: string | null;
}

export const useBalance = ({ token, address }: UseBalanceArgs) => {
  const { client } = useWallet();

  const { data, ...rest } = useQuery(["balance", token, address], () => {
      if (address == null || client == null || token == null) {
        console.log({address,token, client})
      throw new Error("Error in fetching balance");
    }

    // TODO: isNativeToken function
    if (token.startsWith("u")) {
      return client.getBalance(address, token);
    }

    return client.queryContractSmart(token, { balance: { address } });
  });

  if (data == null) {
    return { data, ...rest };
  }

  if (isBalanceResponse(data)) {
    return { data: data.balance, ...rest };
  }

  return { data: data.amount, ...rest };
};

export default useBalance;