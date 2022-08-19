import MySteak from "modules/steak/MySteak";
import Head from "next/head";
import UnbondQueue from "modules/steak/UnbondQueue";
import { useCWClient } from "@wizard-ui/react";
import { SteakProps } from "./_app";
import { Text } from "@chakra-ui/react";
import Credit from "modules/steak/Credit";

export default function Web({ network, chain}: SteakProps) {
  const client = useCWClient();

  if (!network || !client) {

    return <Text bg="white">Error. No network</Text>;
  }

  return (
    <>
      <Head>
        <title>Steak | My Steak</title>
      </Head>
      <MySteak network={network}  client={client} chain={chain}/>
      <UnbondQueue network={network} client={client} chain={chain}/>
      <Credit network={network} client={client} chain={chain}/>
    </>

  );
}
