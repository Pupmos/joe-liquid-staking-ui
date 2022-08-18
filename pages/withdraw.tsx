import Head from "next/head";

import { SteakProps } from "./_app";
import { useCWClient } from "@wizard-ui/react";
import WithdrawForm from "modules/steak/WithdrawForm";

export default function WithdrawPage({ network, chain }: SteakProps) {
  const client = useCWClient();

  return (
    <>
      <Head>
        <title>Steak | Withdraw Unbonded</title>
      </Head>
      <WithdrawForm  chain={chain} network={network} client={client}/>
    </>
  );
};

