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
import { Any } from "cosmjs-types/google/protobuf/any";
// define window type
declare global {
  interface Window {
    getOfflineSigner: any;
    keplr: any;
  }
}


// polyfill wizard suggest chain

const keplrConnect = KeplrWalletAdapter.prototype.connect;
KeplrWalletAdapter.prototype.connect = async function () {
  const name = "Just Joe";
  const CHAIN_ID = "joe-1";
  const RPC_ENDPOINT = "https://joe-rpc.polkachu.com:443";
  const REST_ENDPOINT = "https://joe-api.polkachu.com:443";
  const bondDenom = "ujoe";
  const tokenDenom = "ujoe";

  const suggest = async () => {
    // Keplr extension injects the offline signer that is compatible with cosmJS.
    // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
    // And it also injects the helper function to `window.keplr`.
    // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
    if (!window.getOfflineSigner || !window.keplr) {
      console.warn("Please install keplr extension");
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain({
            // Chain-id of the Osmosis chain.
            chainId: CHAIN_ID,
            // The name of the chain to be displayed to the user.
            chainName: name,
            // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
            rpc: RPC_ENDPOINT,
            // REST endpoint of the chain.
            rest: REST_ENDPOINT,
            // Staking coin information
            stakeCurrency: {
              // Coin denomination to be displayed to the user.
              coinDenom: "JOE",
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: bondDenom,
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 6,
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              // coinGeckoId: ""
            },
            bip44: {
              // You can only set the coin type of BIP44.
              // 'Purpose' is fixed to 44.
              coinType: 118,
            },
            // Bech32 configuration to show the address to user.
            // This field is the interface of
            bech32Config: {
              bech32PrefixAccAddr: "joe",
              bech32PrefixAccPub: "joepub",
              bech32PrefixValAddr: "joevaloper",
              bech32PrefixValPub: "joevaloperpub",
              bech32PrefixConsAddr: "joevalcons",
              bech32PrefixConsPub: "joevalconspub",
            },
            // List of all coin/tokens used in this chain.
            currencies: [
              {
                // Coin denomination to be displayed to the user.
                coinDenom: "JOE",
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: tokenDenom,
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                coinGeckoId: "terra-luna-2",
              },
            ],
            // List of coin/tokens used as a fee token in this chain.
            feeCurrencies: [
              {
                // Coin denomination to be displayed to the user.
                coinDenom: "JOE",
                // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
                coinMinimalDenom: tokenDenom,
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                coinGeckoId: "terra-luna-2",
              },
            ],
            coinType: 118,
            // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.03,
            },
          });
        } catch {
          alert("Failed to suggest the chain");
        }
      } else {
        alert("Please use the recent version of keplr extension");
      }
    }
  };
  return suggest().finally(() => {
    return keplrConnect.call(this);
  });
};

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
      new LeapWalletAdapter({
        endpoint,
        chainId,
        options: {
          gasPrice: GasPrice.fromString("0.015ujoe"),
        },
      }),
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
