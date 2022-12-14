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
  Select,
  useToast,
  Spinner,
  Stack,
  Progress,
  ProgressLabel,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

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
import { useConfig, useValidatorMiningPowers, useValidators } from "hooks";
import { useMutation } from "@tanstack/react-query";

const bondOrUnbondStyle = {
  transition: "0.2s all",
  outline: "none",
  borderRadius: "md",
  color: "accent.600",
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

const localEarningsStorage = {
  get: () => {
    const earnings = localStorage.getItem("mining_earnings");
    if (earnings) {
      return BigInt(earnings);
    }
    return BigInt(0);
  },
  set: (earnings: bigint) => {
    localStorage.setItem("mining_earnings", earnings.toString());
  },
};

const MySteak: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();
  const steakBalance = useBalance({ address, token: network.steak });
  const validators = useValidators({ api: network.api });
  const hubConfig = useConfig({ client: client, hub: network.hub });
  const [validator, setValidator] = useState<string | undefined>(undefined);
  const toast = useToast();
  const miner = useMiner(network.hub, validator);
  const validatorMiningPowers = useValidatorMiningPowers(
    { client, hub: network.hub },
    miner.currentSubmittedProof?.proof.hash,
  );
  // convert { address, mining_power }[] array to an array of ratios for the progress bar
  const validatorMiningPowerRatios = useMemo(() => {
    if (!validatorMiningPowers.data) return [];
    const totalMiningPower = validatorMiningPowers.data.reduce(
      (acc, cur) => acc + +cur.mining_power,
      0,
    );
    return validatorMiningPowers.data.map((v) => ({
      ...v,
      ratio: +v.mining_power / totalMiningPower,
    }));
  }, [validatorMiningPowers.data]);

  useEffect(() => {
    console.log({
      params: miner.currentMinerParams,
    });
  }, [miner.currentMinerParams]);
  const allowedValidators = useMemo(
    () =>
      validators.data?.validators.filter((v) =>
        hubConfig.data.validators.includes(v.operator_address),
      ),
    [validators.data, hubConfig.data],
  );
  useEffect(() => {
    if (
      !miner.currentSubmittedProof ||
      !miner.currentSubmittedProof.proof.success
    )
      return;

    let amountEarned = "";
    console.log(miner.currentSubmittedProof);
    if (miner.currentSubmittedProof.tx.events) {
      for (const event of miner.currentSubmittedProof.tx.events) {
        if (event.type !== "coin_received") {
          continue;
        }
        const amount = event.attributes.find((a) => a.key === "amount");
        const receiver = event.attributes.find((a) => a.key === "receiver");
        if (amount && receiver && receiver.value === address) {
          amountEarned = amount.value.replace(network.denom, "");
          localEarningsStorage.set(
            localEarningsStorage.get() + BigInt(amountEarned),
          );
          break;
        }
      }
    }

    console.log(miner.currentSubmittedProof.tx.events);
    toast({
      title: `Mined a block! You earned ${+amountEarned / 1e6}`,
      description: (
        <>
          <Text>
            <>Nonce: {miner.currentMinedProof?.nonce.toLocaleString()}</>
          </Text>
          {/* link to mintscan */}
          <Text>
            <chakra.a
              href={
                network.tx_explorer +
                miner.currentSubmittedProof.tx.transactionHash
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Explorer
            </chakra.a>
          </Text>
        </>
      ),
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }, [miner.currentSubmittedProof]);
  const startMining = useCallback(() => {
    if (validator) {
      miner.startMiner();
      toast({
        title: "Mining started",
        description:
          "You are now mining for " +
            allowedValidators?.find((v) => v.operator_address === validator)
              ?.description.moniker || validator,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Select a validator",
        description: "You must select a validator to start mining",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [validator, miner, toast]);

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
        bg="accent.600"
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
          position={"relative"}
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
            direction={"column"}
            justify="center"
            mt="10"
            height={"100%"}
          >
            <h2>
              You have earned {+localEarningsStorage.get().toString() / 1e6} JOE
            </h2>
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
              gif contributed by{" "}
              <a target={"_blank"} href="https://twitter.com/ShutenDoji20">
                @ShutenDoji20
              </a>{" "}
              and{" "}
              <a target={"_blank"} href="https://twitter.com/MemeCaesar">
                @MemeCaesar
              </a>
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
              onClick={startMining}
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
          <chakra.a
            cursor={"pointer"}
            {...bondOrUnbondStyle}
            onClick={() => miner.updateEntropyMutation.mutateAsync()}
          >
            Update Entropy
          </chakra.a>
        </Flex>
        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          mt="10"
        >
          <TableContainer
            bg="white"
            width={"80%"}
            textColor={"accent.600"}
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
                  <Td>validator</Td>
                  <Td isNumeric>
                    {allowedValidators ? (
                      <Select
                        isInvalid={!validator}
                        disabled={miner.minerStatus === "running"}
                        size={"xs"}
                        cursor={"pointer"}
                        placeholder="Select validator"
                        value={validator}
                        onChange={(e) => {
                          setValidator(e.target.value);
                        }}
                      >
                        {allowedValidators
                          ?.sort((a, b) => +b.tokens - +a.tokens)
                          .map((v, i) => (
                            <option
                              key={v.operator_address}
                              value={v.operator_address}
                            >
                              {(i + 1).toString().padStart(2, "0")}.&nbsp;
                              {v.description.moniker}
                              {" - "}
                              {v.operator_address.slice(0, 10)}
                              {"..."}
                              {v.operator_address.slice(-10)}
                            </option>
                          ))}
                      </Select>
                    ) : (
                      <Spinner size="xs" />
                    )}
                  </Td>
                </Tr>
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
                      .padStart(
                        +miner.currentMinerParams.difficulty.toString() +
                          miner.currentMinerParams.difficulty.toString().length,
                        "0",
                      )}
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
        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          align={"center"}
          mt="10"
          width={"100%"}
        >
          <TableContainer
            bg="white"
            width={"80%"}
            textColor={"accent.600"}
            borderRadius="2xl"
            p="4"
          >
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>validator</Th>
                  <Th isNumeric>mining power</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* progress bar of validators by their moniker and validatorMiningPowerRatios */}
                {allowedValidators
                  ?.sort((a, b) => {
                    return (
                      (validatorMiningPowerRatios.find(
                        (v) => v.address === b.operator_address,
                      )?.ratio || 0) -
                      (validatorMiningPowerRatios.find(
                        (v) => v.address === a.operator_address,
                      )?.ratio || 0)
                    );
                  })
                  .map((allowedValidator, index) => {
                    const validator = validatorMiningPowerRatios.find(
                      (v) => v.address === allowedValidator.operator_address,
                    ) || {
                      address: allowedValidator.operator_address,
                      ratio: 0,
                      mining_power: 0,
                    };
                    return (
                      <Tr key={index}>
                        <Td>
                          {
                            validators.data?.validators.find(
                              (v) => v.operator_address === validator.address,
                            )?.description.moniker
                          }
                        </Td>

                        <Td isNumeric>
                          <Flex w="100%" align="center" justify="space-between">
                            <Text fontSize="xs" mr="3">
                              {formatNumber(validator.ratio * 100, 2).padStart(
                                6,
                                "0",
                              )}
                              %
                            </Text>

                            <Progress
                              w="full"
                              colorScheme="green"
                              size="sm"
                              value={validator.ratio * 130}
                            />
                          </Flex>
                        </Td>
                        {/*  */}
                      </Tr>
                    );
                  })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>validator</Th>
                  <Th isNumeric>mining power</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Flex>

        
      </Box>
    </>
  );
};

export default MySteak;
