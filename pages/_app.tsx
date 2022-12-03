import React, { useEffect, useMemo, useState } from "react";
import { AppProps } from "next/app";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletModalProvider, WalletProvider } from "@wizard-ui/react";
import { KeplrWalletAdapter } from "@wizard-ui/wallet-keplr";
import { CosmostationWalletAdapter } from "@wizard-ui/wallet-cosmostation";
import "d3-format";
import { Layout } from "modules/common";
import theme from "../theme";
import { chain_details, chains, chainDetails } from "modules/constants";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { NextPageContext } from "next";
import { LeapWalletAdapter } from "../modules/util/WizardLeapWalletAdapter";
import "@wizard-ui/react/style.css";

const queryClient = new QueryClient();

export interface SteakProps {
  network: chain_details;
  chain: string;
  client: CosmWasmClient | null;
}

interface HostProps extends AppProps {
  host: string;
  defaultChain: string;
}

const MyApp = ({ Component, pageProps, host, defaultChain }: HostProps) => {
  console.log("host/chain", host, defaultChain);
  // You can also provide a custom RPC endpoint
  const [chain, setChain] = useState<string>(defaultChain);
  const [network, setNetwork] = useState<chain_details>(
    chainDetails(defaultChain),
  );

  useEffect(() => {
    if (chain) {
      setNetwork(chainDetails(chain));
    } else {
      setNetwork(chainDetails(defaultChain));
    }
  }, [chain]);
  // console.log("chain=",chain);
  // console.log("network=",network);
  const endpoint = useMemo(() => {
    //  console.log("in endpoint", chain);
    return chains[chain].rpc;
  }, [chain]);
  const chainId = useMemo(() => network.chain, [chain, network]);
  const wallets = useMemo(() => {
    return [
    // keplr doesnt support anything that is not in the chain registry
    //   new LeapWalletAdapter({
    //     endpoint,
    //     chainId,
    //     options: {
    //       gasPrice: GasPrice.fromString("0.015ujoe"),
    //     },
    //   }),
      new KeplrWalletAdapter({
        endpoint,
        chainId,
        options: {
          gasPrice: GasPrice.fromString("0.015ujoe"),
        },
      }),
    ];
  }, [endpoint, chainId, chain]);

  return (
    <ChakraProvider theme={theme}>
      <WalletProvider
        endpoint={network.rpc}
        wallets={wallets}
        chainId={chainId}
      >
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <CSSReset />
            <Layout
              network={network}
              chain={chain}
              setChain={setChain}
              chainId={chainId}
              client={null}
            >
              <Component
                {...pageProps}
                network={network}
                chain={chain}
                client={null}
              />
            </Layout>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ChakraProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const DEFAULTCHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "XXX";
  console.log({ DEFAULTCHAIN });
  // if (ctx.req) {
  //     const host = ctx.req.headers.host // will give you localhost:3000
  //     if (host) {
  //         console.log('host=', host);
  //         if (host.includes("vercel") || host.includes("localhost")) {
  //             return {host, defaultChain: DEFAULTCHAIN};
  //         }
  //         const dotPosn = host.indexOf(".");
  //         if (dotPosn >= 0) {
  //             const chain = host.substring(0, dotPosn);
  //             return {host: host, defaultChain: chain};
  //         }
  //         return {host: host, defaultChain: DEFAULTCHAIN};
  //     }
  // }
  return { host: "no host", defaultChain: DEFAULTCHAIN };
};
export default MyApp;
