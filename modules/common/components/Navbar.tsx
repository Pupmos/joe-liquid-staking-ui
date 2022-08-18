import React, { Dispatch, SetStateAction } from "react";
import { Flex, Box, HStack, Text, chakra } from "@chakra-ui/react";

import { CosmosWallet } from "./CosmosWallet";
import SteakIcon from "modules/steak/SteakIcon";
import { SteakProps } from "../../../pages/_app";
import NextLink from "next/link";

interface NavbarProps extends SteakProps {
  setChain: Dispatch<SetStateAction<string>>;
  chainId: string;
}

export function Navbar({
                        network,
                         chain,
                         client,
                       }: NavbarProps) {
  /*
  const defined_chains = Object.keys(chains);
  // console.log("defined_chains = ", defined_chains);

  const handleClick = (chain: string) => {
    console.log("setting chain to ", chain);
    setChain(chain);
  };*/

  return (
    <Flex
      backdropFilter="blur(40px)"
      position="sticky"
      height="80px"
      top="0"
      align="center"
      px="10"
      zIndex="10"
      justify="space-between"
      borderBottom="1px solid #1c1c22"

    >
      <Box flex="1">
        <HStack flex="1" spacing="6" justify="flex" key="logo">
          <NextLink href={"/"} passHref={true}>
            <chakra.a><SteakIcon w={["3rem", "4rem"]} h={["3rem", "4rem"]} /></chakra.a>
          </NextLink>
          <NextLink href={"/"} passHref={true}>
            <chakra.a><Text color={"brand.white"}>{network.name}</Text></chakra.a>
          </NextLink>

        </HStack>
      </Box>
      {/*
      <HStack flex="1" spacing="6" justify="flex" key="network-chooser">
        <Text color="brand.white" opacity={0.5}>Switch To</Text>
        {defined_chains.map((chain) => (<div key={chains[chain].chain}>
          {chains[chain].chain !== chainId && <Button type="button" key={chains[chain].chain}
                                                      onClick={() => handleClick(chain)}>{chain}</Button>
          }

        </div>))}
      </HStack>
      */}
      <HStack flex="1" spacing="6" justify="flex-end" key={"wallet"}>
        <CosmosWallet network={network}  client={client}  chain={chain} />
      </HStack>
    </Flex>
  );
}
