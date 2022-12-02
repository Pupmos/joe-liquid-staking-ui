import { useDisclosure, Box, Flex, Button, Text } from "@chakra-ui/react";

import { FC, useEffect, useState } from "react";

import { SteakProps } from "../../pages/_app";
import AssetInput from "modules/common/components/AssetInput";
import Header from "modules/common/components/Header";
import ArrowDownIcon from "modules/common/components/Icons/ArrowDownIcon";
import TxModal from "modules/common/components/TxModal";
import { convertFromMicroDenom, encodeBase64, truncateDecimals } from "modules/util/conversion";
import { useWallet } from "@wizard-ui/react";
import { EncodeObject } from "@cosmjs/proto-signing";
import { useHubState, usePendingBatch } from "../../hooks";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import useBalance from "hooks/useBalance";

const UnbondForm: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();
  const prices = { steak: 0.0, native: 0.0 };
  const denomBalance = useBalance({ address, token: network.denom });
  const steakBalance = useBalance({ address, token: network.steak });
  const hubState = useHubState({ client, hub: network.hub });

  const pendingBatch = usePendingBatch({ client, hub: network.hub });

  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [msgs, setMsgs] = useState<EncodeObject[]>([]);
  //const { contracts } = useConstants(wallet?.network.name);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (address && network && offerAmount > 0) {
      const sendMsg ={send:{
        contract: network.hub,
        amount: (offerAmount * 1e6).toString(),
        msg: encodeBase64({ queue_unbond: {} }),
      }};

      const messages: EncodeObject[] = [
        {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: MsgExecuteContract.fromPartial({
            sender: address,
            contract: network.steak,
            msg: toUtf8(JSON.stringify(sendMsg))
          })
        }
      ];
      setMsgs(messages);
      /*
      setMsgs([
        new MsgExecuteContract(address, network.steak, {
          send: {
            contract: network.hub,
            amount: (offerAmount * 1e6).toString(),
            msg: encodeBase64({ queue_unbond: {} }),
          },
        }),
      ]);*/
    } else {
      setMsgs([]);
    }
  }, [offerAmount, chain,network.denom,address,network.hub]);

  if (pendingBatch.isLoading || hubState.isLoading || steakBalance.isLoading || denomBalance.isLoading) {
    return <Text bg="white">Loading...</Text>;
  }
  if (pendingBatch.isError || hubState.isError || steakBalance.isError || denomBalance.isError) {
    console.log('unbond',pendingBatch.isLoading,pendingBatch.isError, pendingBatch.data);
    return <Text bg="white">Error...</Text>;
  }

  const handleOfferAmountChange = (newOfferAmount: number) => {
    if (!steakBalance.isLoading && steakBalance.data > 0) {
      newOfferAmount = Math.min(newOfferAmount,steakBalance.data / 1e6);
    }
    const exchangeRate = hubState.data.exchange_rate
    setOfferAmount(newOfferAmount);
    setReturnAmount(exchangeRate ? truncateDecimals(newOfferAmount * exchangeRate) : 0);
  };

  const nextBatchTime = new Date( pendingBatch.data.est_unbond_start_time*1000);
  const nextBatchTimeStr =nextBatchTime
    ? new Date() < nextBatchTime
      ? nextBatchTime.toLocaleString()
      : "Now"
    : "Unknown";

  return (
    <Box maxW="container.sm" mx="auto">
      <Header text="Unstake WETJOE" />
      <Box position="relative">
        <AssetInput
          assetSymbol="WETJOE"
          assetLogo="/pupjoes.jpg"
          price={prices.steak}
          balance={!steakBalance.isLoading ? steakBalance.data  / 1e6 : 0}
          isEditable={true}
          onAmountChange={handleOfferAmountChange}
        />
        <Flex
          justify="center"
          align="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <ArrowDownIcon
            w="3rem"
            h="3rem"
            fill="brand.red"
            bg="white"
            border="solid 6px white"
            borderRadius="full"
          />
        </Flex>
        <AssetInput
          assetSymbol={convertFromMicroDenom(network.denom)}
          assetLogo={`/${network.denom}.png`}
          price={prices.native}
          balance={!denomBalance.isLoading ? denomBalance.data / 1e6 : 0}
          isEditable={false}
          fixedAmount={returnAmount}
        />
      </Box>
      <Box color="black" bg="white" p="6" mt="2" borderRadius="2xl" position="relative">
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="800">
            {nextBatchTimeStr}
          </Text>
          <Text opacity="0.4" mt="3">
            Next Batch Time
          </Text>
        </Box>
        <Text fontSize="sm" opacity="0.4" mt="6">
          Due to limitations imposed by the cosmos-based chains, the protocol may not be able to serve all
          unstaking requests from users on-demand. Instead, unstaking requests are collected over a
          3-day period, and submitted together in a batch. The unstaking period lasts for 21 (28 for Juno) days
          after the batch is submitted. Use the Steak webapp to claim the unstaked {convertFromMicroDenom(network.denom)} after the 21/28
          days.
        </Text>
      </Box>
      <Box textAlign="center">
        <Button
          type="button"
          variant="solid"
          mt="6"
          onClick={onOpen}
          isLoading={false}
          bg={"brand.red"}
          isDisabled={!address || offerAmount == 0}
        >
          Unstake
        </Button>

        <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
          {""}
        </Text>
        <TxModal isOpen={isOpen} onClose={onClose} msgs={msgs} network={network} chain={chain} client={client}/>
      </Box>
    </Box>
  );
};

export default UnbondForm;
