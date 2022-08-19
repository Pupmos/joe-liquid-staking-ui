/*
  export const DENOM = "ujunox";
  export const RPC = "https://rpc.uni.junonetwork.io";
  export const CHAIN = "uni-3";
  export const STEAK = "juno1w675s76fn0wt6yumh87akuedxp4h3lyf3vkcwxr256g30555zc4spl30gp";
  export const HUB = "juno1plaat9jusdhrtfltcxjam2e0m2ens3wgvlrg0seq07fq34hy908q754vj7";

export const DENOM = "uluna";
export const RPC = "https://terra-rpc.stakely.io";
export const CHAIN = "phoenix-1";
export const STEAK = "terra1xumzh893lfa7ak5qvpwmnle5m5xp47t3suwwa9s0ydqa8d8s5faqn6x7al";
export const HUB = "terra12e4v50xl33fnwkzltz9vu565snlmx65vdrk8e2644km09myewr8q538psc";

 */
export interface validator_credit {
    name: string;
    logo: string;
    delegate_url: string;
}

export interface chain_details {
    denom: string;
    rpc: string;
    api: string;
    chain: string;
    multiquery: string;
    multicall: string;
    steak: string;
    hub: string;
    name: string;
    tx_explorer: string;
    gas_price: string;
    validators: validator_credit[]
}

interface supported_chains {
    [key: string]: chain_details;
}

export const chains: supported_chains = {
    "LUNA": {
        denom: "uluna",
        rpc: "https://terra-rpc.polkachu.com",
        api: "https://terra-api.polkachu.com",
        chain: "phoenix-1",
        name: "Luna 2.0",
        steak: "terra1xumzh893lfa7ak5qvpwmnle5m5xp47t3suwwa9s0ydqa8d8s5faqn6x7al",
        multiquery: "terra1m277jus3ahphsy6wml8kdwrz2ecf7wy4ggncz6d9xmhd2a29qyss3zakjl",
        multicall: "terra1m277jus3ahphsy6wml8kdwrz2ecf7wy4ggncz6d9xmhd2a29qyss3zakjl",
        hub: "terra12e4v50xl33fnwkzltz9vu565snlmx65vdrk8e2644km09myewr8q538psc",
        tx_explorer: "https://finder.terra.money/mainnet/tx/",
        gas_price: "0.02uluna",
        validators: []
    },
    "JUNO": {
        denom: "ujunox",
        rpc: "https://rpc.uni.junonetwork.io",
        api: "https://api.uni.junonetwork.io/",
        chain: "uni-3",
        name: "Juno Testnet",
        steak: "juno1w675s76fn0wt6yumh87akuedxp4h3lyf3vkcwxr256g30555zc4spl30gp",
        multiquery: "juno1q49nd5wyecxc64hmuqr3ax3get0pt337frwjqg0lxx5lagv3vfgsa5quh0",
        multicall: "juno1l7vrwvhvfea0wd2ch4qs9u0vrqr0pynxddft70kw0dgjuj0tzvys73hnuc",
        hub: "juno1plaat9jusdhrtfltcxjam2e0m2ens3wgvlrg0seq07fq34hy908q754vj7",
        tx_explorer: "https://testnet.mintscan.io/juno-testnet/txs/",
        gas_price: "0.04ujuno",
        validators: [{
            name: "Obi",
            logo: "obi",
            delegate_url: "https://restake.app/juno/junovaloper14ts0j42qkpr43a3tgxr7zz6l6zdf7hdethuxxd"
        },
         /*   {
            name: "PUPMØS",
            logo: "pumpos",
            delegate_url: "https://restake.app/juno/junovaloper1ka8v934kgrw6679fs9cuu0kesyl0ljjy2kdtrl"
        }*/
        ]
    }
};

export function chainDetails(network: string): chain_details {
    if (chains[network]) {
        return chains[network];
    }

    throw new Error(`Unsupported network: ${network}`);
}
