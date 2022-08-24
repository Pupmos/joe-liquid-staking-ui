import Head from "next/head";

import { SteakProps } from "./_app";
import { useCWClient } from "@wizard-ui/react";
import UnbondForm from "modules/steak/UnbondForm";
import {Text} from "@chakra-ui/react";


export default function UnBondPage({ network, chain }: SteakProps) {

  const client = useCWClient();
    if (!network || !client) {

        return <Text bg="white">Error. No network</Text>;
    }
  return (
    <>
      <Head>
        <title>Steak | Unbond</title>
      </Head>
      <UnbondForm  chain={chain} network={network} client={client}/>
    </>
  );
};

