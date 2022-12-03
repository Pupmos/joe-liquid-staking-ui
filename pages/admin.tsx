import Head from "next/head";
import { useWallet } from "@wizard-ui/react";
import { SteakProps } from "./_app";
import { Text } from "@chakra-ui/react";
import Admin from "modules/steak/Admin";

export default function adminPage({ network, chain}: SteakProps) {
  const { client } = useWallet()

  if (!network || !client) {
    return <Text bg="white">Error. No network</Text>;
  }

  return (
    <>
      <Head>
        <title>WetJoe | Admin Operations</title>
      </Head>
      <Admin network={network} client={client} chain={chain}/>
    </>

  );
}
