import MySteak from "modules/steak/MySteak";
import Head from "next/head";
import UnbondQueue from "modules/steak/UnbondQueue";
import { SteakProps } from "./_app";
import { Text } from "@chakra-ui/react";
import Credit from "modules/steak/Credit";
import { useWallet } from "@wizard-ui/react";
import init, { mine } from "wasm-miner";
import { useEffect } from "react";

export default function Web({ network, chain }: SteakProps) {
  const { client } = useWallet();
  useEffect(() => {
    init().then((wasm) => {
      const result = mine(
        "f1d518ef1e6e0814d30ffe4f2fd3c06a2ee358bb2afaf63fa649e2e38a9c142e",
        "joe1gh9nds8amsy33ewpt97gj4n99436hftz2zl79q",
        BigInt(1),
      );
      console.log({ result });
    });
  });
  if (!network || !client) {
    return <Text bg="white">Error. No network</Text>;
  }

  return (
    <>
      <Head>
        <title>Pupjoes | My Pupjoes</title>
      </Head>
      <MySteak network={network} client={client} chain={chain} />
      <UnbondQueue network={network} client={client} chain={chain} />
      <Credit network={network} client={client} chain={chain} />
    </>
  );
}
