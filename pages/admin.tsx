import Head from "next/head";
import { useCWClient } from "@wizard-ui/react";
import { SteakProps } from "./_app";
import { Text } from "@chakra-ui/react";
import Admin from "modules/steak/Admin";

export default function adminPage({ network, chain}: SteakProps) {
  const client = useCWClient();

  if (!network || !client) {
    return <Text bg="white">Error. No network</Text>;
  }

  return (
    <>
      <Head>
        <title>Steak | Admin Operations</title>
      </Head>
      <Admin network={network} client={client} chain={chain}/>
    </>

  );
}
