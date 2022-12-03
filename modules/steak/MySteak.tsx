import {
  chakra,
  Box,
  Flex,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
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
    console.log("WetJoe Balance Error", steakBalance.error);
    return <Header text="Error" />;
  }
  const steakDenomBalance = convertMicroDenomToDenom(steakBalance.data);
  const steakValue =
    steakBalance && prices.steak ? steakBalance.data * prices.steak : undefined;

  return (
    <>
      {/* <Box color='white' bg='red'>WetJoe is closing down.. this site will stay up for people to unstake their tokens</Box> */}
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
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          position={'relative'}
        >
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            opacity={miner.minerStatus == "running" ? 0 : 1}
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
          </Flex>
          <Flex
            opacity={miner.minerStatus == "stopped" ? 0 : 1}
            position="absolute"
            direction={'column'}
            justify="center"
            mt="10"
            height={"100%"}
          >
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
                height: "100%",
                backgroundColor: "black",
                top: "0%",
                left: "0%",
                transform: "rotate(0deg) scale(1.005)",
              }}
            ></video>
            {/* subtle credit to creator of gif */}
            <Text
              // position="absolute"
              width={"100%"}
              bottom="0"
              right="0"
              color="brand.lightBrown"
              fontSize="xs"
            >
              gif contributed by <a target={"_blank"} href="https://twitter.com/ShutenDoji20">@ShutenDoji20</a> and <a target={"_blank"} href="https://twitter.com/MemeCaesar">@MemeCaesar</a>
            </Text>
          </Flex>
        </Flex>
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

        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          mt="10"
        >
          <TableContainer
            bg="white"
            width={"80%"}
            textColor={"brand.red"}
            borderRadius="2xl"
            p="4"
          >
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>metric</Th>
                  <Th isNumeric>value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>hash</Td>
                  <Td isNumeric>
                    {miner.currentMinedProof?.hash.substring(0, 30)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>nonce</Td>
                  <Td isNumeric>
                    {miner.currentMinedProof?.nonce.toLocaleString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td>entropy</Td>
                  <Td isNumeric>
                    {miner.currentMinerParams?.entropy.substring(0, 30)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>difficulty</Td>
                  <Td isNumeric>
                    {miner.currentMinerParams?.difficulty
                      .toLocaleString()
                      .padStart(+miner.currentMinerParams.difficulty.toString() + miner.currentMinerParams.difficulty.toString().length, "0")}
                  </Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Metric</Th>
                  <Th isNumeric>Value</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
          {/* <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? "Mining is stopped"
              : "Mining is running"}
          </Text>
          <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? ""
              : "Hash: " + miner.currentMinedProof?.hash}
          </Text>
          <Text color="brand.lightBrown" mt="5">
            {miner.minerStatus === "stopped"
              ? ""
              : "Nonce: " + miner.currentMinedProof?.nonce}
          </Text> */}
        </Flex>
      </Box>
    </>
  );
};

export default MySteak;
