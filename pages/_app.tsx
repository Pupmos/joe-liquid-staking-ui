import React, {useEffect, useMemo, useState} from "react";
import { AppProps} from "next/app";
import {ChakraProvider, CSSReset} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CosmostationWalletAdapter, KeplrWalletAdapter} from "@wizard-ui/core";
import {CWClientProvider, WalletModalProvider, WalletProvider} from "@wizard-ui/react";
import "d3-format";
import {Layout} from "modules/common";
import theme from "../theme";
import {chain_details, chains, chainDetails} from "modules/constants";
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {GasPrice} from "@cosmjs/stargate";
import {NextPageContext} from "next";

const queryClient = new QueryClient();

export interface SteakProps {
    network: chain_details;
    chain: string;
    client: CosmWasmClient | null;
}

interface HostProps extends AppProps {
    host: string,
    defaultChain: string,
}
const MyApp = ({Component, pageProps, host,defaultChain}: HostProps) => {

    console.log("host", pageProps, host);
    // You can also provide a custom RPC endpoint
    const [chain, setChain] = useState<string>(defaultChain);
    const [network, setNetwork] = useState<chain_details>(chainDetails(defaultChain));
    GasPrice;

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
                            <CSSReset/>
                            <Layout network={network} chain={chain} setChain={setChain} chainId={chainId}
                                    client={null}>
                                <Component {...pageProps} network={network} chain={chain} client={null}/>

                            </Layout>


                        </QueryClientProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </CWClientProvider>
        </ChakraProvider>
    );
};

MyApp.getInitialProps = async ({ctx}: { ctx: NextPageContext; }) => {

    const DEFAULTCHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "XXX";
    if (ctx.req) {
        const host = ctx.req.headers.host // will give you localhost:3000
        console.log('host.', host);
        return {host: host, defaultChain: DEFAULTCHAIN};
    }
    return {host: "no host", defaultChain: DEFAULTCHAIN};
}
export default MyApp;
