import Head from "next/head";

import { SteakProps } from "./_app";
import { useWallet } from "@wizard-ui/react";
import UnbondForm from "modules/steak/UnbondForm";
import { Text } from "@chakra-ui/react";


export default function UnBondPage({ network, chain }: SteakProps) {

  const { client } = useWallet()
  if (!network || !client) {

    return <Text bg="white">Error. No network</Text>;
  }
  return (
    <>
      <Head>
        <title>WetJoe | Unbond</title>
      </Head>
      <UnbondForm chain={chain} network={network} client={client} />
    </>
  );
};

