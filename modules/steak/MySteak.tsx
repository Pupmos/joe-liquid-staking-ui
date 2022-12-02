import { chakra, Box, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

import Header from "../common/components/Header";
//import JunoSwapIcon from "modules/steak/chains/juno/JunoSwapIcon";
import { useWallet } from "@wizard-ui/react";
import {
  convertFromMicroDenom,
  convertMicroDenomToDenom,
  formatNumber,
} from "modules/util/conversion";
import { SteakProps } from "../../pages/_app";
import { TerraMySteak } from "modules/steak/chains/terra/TerraMySteak";
import { JunoMySteak } from "modules/steak/chains/juno/JunoMySteak";
import useBalance from "hooks/useBalance";
import { useMiner } from "hooks/useMiner";

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
    textDecoration: "none",
  },
};

const MySteak: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();
  const steakBalance = useBalance({ address, token: network.steak });
  const miner = useMiner(network.hub);

  const prices = { steak: 0.0 };

  if (!address) {
    return <Header text="Please Connect" />;
  }
  if (steakBalance.isLoading) {
    return <Header text="Loading..." />;
  }
  if (steakBalance.error) {
    console.log("Pupjoes Balance Error", steakBalance.error);
    return <Header text="Error" />;
  }
  const steakDenomBalance = convertMicroDenomToDenom(steakBalance.data);
  const steakValue =
    steakBalance && prices.steak ? steakBalance.data * prices.steak : undefined;

  return (
    <>
      {/* <Box color='white' bg='red'>Pupjoes is closing down.. this site will stay up for people to unstake their tokens</Box> */}
      <Header text="My WETJOES">
        {chain === "LUNA" && (
          <TerraMySteak network={network} chain={chain} client={client} />
        )}
        {chain === "juno" && (
          <JunoMySteak network={network} chain={chain} client={client} />
        )}
        &nbsp;
      </Header>
      <Box
        color="white"
        bg="brand.red"
        p="12"
        mb="4"
        borderRadius="2xl"
        textAlign="center"
      >
        <Text fontSize="6xl" fontWeight="800">
          {steakDenomBalance ? formatNumber(steakDenomBalance, 3) : "0.000"}
        </Text>
        <Text fontWeight="800">
          {"($" + (steakValue ? formatNumber(steakValue, 2) : "0.00") + ")"}
        </Text>
        <Text color="brand.lightBrown" mt="5">
          WETJOE balance in wallet
        </Text>
        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          mt="10"
        >
          <NextLink href="/bond" passHref aria-disabled={true}>
            <chakra.a {...bondOrUnbondStyle}>
              Stake {convertFromMicroDenom(network.denom)}
            </chakra.a>
          </NextLink>

          <NextLink href="/unbond" passHref>
            <chakra.a {...bondOrUnbondStyle}>Unstake WETJOE</chakra.a>
          </NextLink>
          {miner.minerStatus === "stopped" ? (
            <chakra.a
              {...bondOrUnbondStyle}
              cursor="pointer"
              onClick={miner.startMiner}
            >
              Start Mining
            </chakra.a>
          ) : (
            <chakra.a
              {...bondOrUnbondStyle}
              cursor="pointer"
              onClick={miner.stopMiner}
            >
              Stop Mining
            </chakra.a>
          )}
        </Flex>
        <Flex>
          {/* <StatGroup>
            <Stat>
              <StatLabel>Sent</StatLabel>
              <StatNumber>345,670</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Clicked</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </StatGroup> */}
          <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? "Mining is stopped"
              : "Mining is running"}
          </Text>
          {/* display miner minedproof */}
          <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? ""
              : "Hash: " + miner.currentMinedProof?.hash}
          </Text>
          <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? ""
              : "Nonce: " + miner.currentMinedProof?.nonce}
          </Text>
        </Flex>
        <Flex justify="center" mt="10">
          <video
            preload="auto"
            tabIndex={-1}
            loop
            playsInline
            autoPlay={true}
            muted
            aria-label="Embedded video"
            disablePictureInPicture
            // poster="https://pbs.twimg.com/dm_gif_preview/1598539516503068673/mO2zAVdAhSb7XQ23Z3YFXKaLCTP0m8H8GH_QSN--gLFd4V0flu.jpg"
            src="/pupmos-mining-animation.mp4"
            typeof="video/mp4"
            // style="width: 100%; height: 100%; position: absolute; background-color: black; top: 0%; left: 0%; transform: rotate(0deg) scale(1.005);"
            style={{
              borderRadius: "8px",
              width: "80%",
              height: "auto",
              backgroundColor: "black",
              top: "0%",
              left: "0%",
              transform: "rotate(0deg) scale(1.005)",
            }}
          ></video>
        </Flex>
      </Box>
    </>
  );
};

export default MySteak;
