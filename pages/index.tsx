import MySteak from "modules/steak/MySteak";
import Head from "next/head";
import UnbondQueue from "modules/steak/UnbondQueue";
import { SteakProps } from "./_app";
import { Text } from "@chakra-ui/react";
import Credit from "modules/steak/Credit";
import { useWallet } from "@wizard-ui/react";

export default function Web({ network, chain}: SteakProps) {
  const { client } = useWallet()

  if (!network || !client) {

    return <Text bg="white">Error. No network</Text>;
  }

  return (
    <>
      <Head>
        <title>Pupjoes | My Pupjoes</title>
      </Head>
      <MySteak network={network}  client={client} chain={chain}/>
      <UnbondQueue network={network} client={client} chain={chain}/>
      <Credit network={network} client={client} chain={chain}/>
    </>

  );
}
