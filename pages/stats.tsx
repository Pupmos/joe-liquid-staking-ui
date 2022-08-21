import { Box, Text } from "@chakra-ui/react";
import Head from "next/head";

import {SteakProps} from "./_app";
import About from "modules/steak/About";
import {useCWClient} from "@wizard-ui/react";
import Overview from "modules/steak/Overview";
import Validators from "modules/steak/Validators";

export default function StatsPage ({ network, chain}: SteakProps)  {
    const client = useCWClient();

    if (!network || !client) {

        return <Text bg="white">Error. No network</Text>;
    }

    return (
    <>
      <Head>
        <title>Steak | Protocol Stats</title>
      </Head>
      <About network={network} chain={chain} client={client}/>
      <Overview network={network} chain={chain} client={client} />
      <Validators network={network} chain={chain} client={client} />
      <Box textAlign="center" my="20">
        <Text fontSize="2xl" fontWeight="800" opacity={0.4}>
          Under construction... More stats coming soon!
        </Text>
      </Box>
    </>
  );
}
