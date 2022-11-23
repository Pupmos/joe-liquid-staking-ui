import Head from "next/head";
import BondForm from "modules/steak/BondForm";
import { SteakProps } from "./_app";
import {Text} from "@chakra-ui/react";
import { useWallet } from "@wizard-ui/react";

export default function BondPage({ network, chain }: SteakProps) {
  const { client } = useWallet()
    if (!network || !client) {
        return <Text bg="white">Error. No network</Text>;
    }
  return (
    <>
      <Head>
        <title>Pupjoes | Bond</title>
      </Head>        
      <BondForm chain={chain} network={network} client={client} />
    </>
  );
};

