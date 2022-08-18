import Head from "next/head";

import { SteakProps } from "./_app";
import { useCWClient } from "@wizard-ui/react";
import UnbondForm from "modules/steak/UnbondForm";


export default function UnBondPage({ network, chain }: SteakProps) {

  const client = useCWClient();
  return (
    <>
      <Head>
        <title>Steak | Unbond</title>
      </Head>
      <UnbondForm  chain={chain} network={network} client={client}/>
    </>
  );
};

