import React, { useEffect, useMemo, useState } from "react";
import { AppProps } from "next/app";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {CosmostationWalletAdapter, KeplrWalletAdapter} from "@wizard-ui/core";
import { CWClientProvider,  WalletModalProvider, WalletProvider } from "@wizard-ui/react";
import "d3-format";
import { Layout } from "modules/common";
import theme from "../theme";
import { chain_details, chains, chainDetails } from "modules/constants";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";

const queryClient = new QueryClient();

export interface SteakProps {
  network: chain_details;
  chain: string;
  client: CosmWasmClient | null;
}
const DEFAULTCHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN|| "XXX";
const MyApp = ({ Component, pageProps }: AppProps) => {
  // You can also provide a custom RPC endpoint
  const [chain, setChain] = useState<string>(DEFAULTCHAIN);
  const [network, setNetwork] = useState<chain_details>(chainDetails(DEFAULTCHAIN));
  GasPrice;

  useEffect(() => {
    if (chain) {
      setNetwork(chainDetails(chain));
    } else {
      setNetwork(chainDetails(DEFAULTCHAIN));
    }
  }, [chain]);
 // console.log("chain=",chain);
 // console.log("network=",network);
  const endpoint = useMemo(() => {
    //  console.log("in endpoint", chain);
    return chains[chain].rpc;
  }, [chain]);
  const chainId = useMemo(() => network.chain, [chain, network]);
  const wallets = useMemo(
    () => {
      return [new KeplrWalletAdapter({
        endpoint,
        chainId,
        options: {
          gasPrice: GasPrice.fromString("0.015uosmo"),
        },
      }), new CosmostationWalletAdapter({
        endpoint,
        chainId,
        chainName: "osmosis testnet",
        options: {
          gasPrice: GasPrice.fromString("0.015uosmo"),
        },
      }),];
    },
    [endpoint, chainId, chain]
  );

  // const client =useCWClient()


  return (
    <ChakraProvider theme={theme}>
      <CWClientProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} chainId={chainId}>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>
              <CSSReset />
              <Layout network={network} chain={chain} setChain={setChain} chainId={chainId}
                      client={null}>
                <Component {...pageProps} network={network} chain={chain}  client={null} />

              </Layout>



            </QueryClientProvider>
          </WalletModalProvider>
        </WalletProvider>
      </CWClientProvider>
    </ChakraProvider>
  );
};

export default MyApp;
