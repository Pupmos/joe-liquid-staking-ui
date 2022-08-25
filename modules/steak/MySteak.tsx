import { chakra, Box, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

import Header from "../common/components/Header";
//import JunoSwapIcon from "modules/steak/chains/juno/JunoSwapIcon";
import { useBalance, useWallet } from "@wizard-ui/react";
import { convertFromMicroDenom, convertMicroDenomToDenom, formatNumber } from "modules/util/conversion";
import { SteakProps } from "../../pages/_app";
import { TerraMySteak } from "modules/steak/chains/terra/TerraMySteak";
import { JunoMySteak } from "modules/steak/chains/juno/JunoMySteak";

const bondOrUnbondStyle = {
  transition: "0.2s all",
  outline: "none",
  borderRadius: "md",
  color: "brand.red",
  bg: "white",
  px: "10",
  py: "2",
  m: "1",
  _hover: {
    color: "brand.black",
    bg: "brand.lightBrown",
    textDecoration: "none"
  }
};

const MySteak: FC<SteakProps> = ({ network,chain,client}) => {
  const { address } = useWallet();
  const steakBalance = useBalance({ address, token: network.steak });

  const prices = {steak: 0.00};

  if (!address) {
    return (<Header text="Please Connect" />);
  }
  if (steakBalance.isLoading) {
    return (<Header text="Loading..." />);
  }
  if (steakBalance.error) {
    console.log('Steak Balance Error',steakBalance.error)
    return (<Header text="Error" />);

  }
  const steakDenomBalance = convertMicroDenomToDenom(steakBalance.data);
  const steakValue = steakBalance && prices.steak ? steakBalance.data * prices.steak : undefined;

  return (
    <>
      <Header text="My Steak">
        {chain === "LUNA" && <TerraMySteak network={network}  chain={chain} client={client} /> }
        {chain === "JUNO" && <JunoMySteak network={network} chain={chain} client={client} /> }

        &nbsp;

      </Header>
      <Box color="white" bg="brand.red" p="12" mb="4" borderRadius="2xl" textAlign="center">
        <Text fontSize="6xl" fontWeight="800">
          {steakDenomBalance ? formatNumber(steakDenomBalance, 3) : "0.000"}
        </Text>
        <Text fontWeight="800">
          {"($" + (steakValue ? formatNumber(steakValue, 2) : "0.00") + ")"}
        </Text>
        <Text color="brand.lightBrown" mt="5">
          STEAK balance in wallet
        </Text>
        <Flex direction={["column", "row", null, null]} justify="center" mt="10">
          <NextLink href="/bond" passHref>
            <chakra.a {...bondOrUnbondStyle}>Stake {convertFromMicroDenom(network.denom)}</chakra.a>
          </NextLink>
          <NextLink href="/unbond" passHref>
            <chakra.a {...bondOrUnbondStyle}>Unstake STEAK</chakra.a>
          </NextLink>
        </Flex>
      </Box>
    </>
  );
};

export default MySteak;
