import Head from "next/head";
import BondForm from "modules/steak/BondForm";
import { SteakProps } from "./_app";
import { useCWClient } from "@wizard-ui/react";

export default function BondPage({ network, chain }: SteakProps) {
  const client = useCWClient();
  return (
    <>
      <Head>
        <title>Steak | Bond</title>
      </Head>
      <BondForm chain={chain} network={network} client={client} />
    </>
  );
};

