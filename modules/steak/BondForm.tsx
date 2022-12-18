import { useDisclosure, Box, Flex, Button, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";


import { SteakProps } from "../../pages/_app";
import { useWallet } from "@wizard-ui/react";
import Header from "modules/common/components/Header";
import ArrowDownIcon from "modules/common/components/Icons/ArrowDownIcon";
import AssetInput from "modules/common/components/AssetInput";
import { convertFromMicroDenom, truncateDecimals } from "modules/util/conversion";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { useHubState } from "hooks";
import TxModal from "modules/common/components/TxModal";
import { EncodeObject } from "@cosmjs/proto-signing";
import useBalance from "hooks/useBalance";
// import { add } from "husky";

const BondForm: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();
  const prices = { steak: 0.0, native: 0.0 };
//  const [isLoading, setIsLoading] = useState(false);

  const denomBalance = useBalance({ address, token: network.denom });
  const steakBalance = useBalance({ address, token: network.steak });
  const exchangeRate = useHubState({ client, hub: network.hub });
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [msgs, setMsgs] = useState<EncodeObject[]>([]);
  //const { contracts } = useConstants(wallet?.network.name);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
      if (network.denom && offerAmount > 0) {
        const jsonMsg = JSON.stringify({
          bond: {}
        });
        const messages: EncodeObject[] = [
          {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: MsgExecuteContract.fromPartial({
              sender: address || undefined,
              contract: network.hub,
              msg: toUtf8(
                jsonMsg
              ),
              funds: [{ denom: network.denom, amount: String(offerAmount * 1e6) }]
            })
          }
        ];

        setMsgs(messages);
      } else {
        setMsgs([]);
      }
    }
    , [offerAmount, chain,network.denom,address,network.hub]);

  const handleOfferAmountChange = (newOfferAmount: number) => {
    setOfferAmount(newOfferAmount);
    setReturnAmount(exchangeRate ? truncateDecimals(newOfferAmount / exchangeRate.data.exchange_rate) : 0);
  };
  if (exchangeRate.isLoading) {
    return <Text bg="white">Loading...</Text>;
  }
  if (exchangeRate.isError) {
    console.log("exchange", exchangeRate.error);
    return <Text bg="white">Error...</Text>;
  }
  //console.log("exchange",exchangeRate.data)
  //console.log("exchange",exchangeRate.status)

  return (
    <Box maxW="container.sm" mx="auto">
      <Header text={`Stake ${convertFromMicroDenom(network.denom)}`} />
      <Box position="relative">

        <AssetInput
          assetSymbol={convertFromMicroDenom(network.denom)}
          assetLogo={`/${network.denom}.png`}
          price={prices.native}
          balance={!Number.isNaN(denomBalance.data + 1) ? denomBalance.data / 1e6 : 0}
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
            fill="accent.300"
            bg="gray.900"
            border="solid 6px"
            borderColor={"gray.900"}
            borderRadius="full"
          />
        </Flex>
        <AssetInput
          assetSymbol="WETJOE"
          assetLogo="/pupjoes.jpg"
          price={prices.steak}
          balance={!steakBalance.isLoading ? steakBalance.data / 1e6 : 0}
          isEditable={false}
          fixedAmount={returnAmount}
        />
      </Box>
      <Box textAlign="center">
        <Button
          type="button"
          variant="solid"
          size='md'
          mt="6"
          onClick={onOpen}
          isLoading={false}
          bg={"accent.600"}
          isDisabled={!address || offerAmount == 0}
          height='48px'
          width='200px'
          border='2px'
        >
          Stake
        </Button>
        <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
          {""}
        </Text>
        <TxModal isOpen={isOpen} onClose={onClose} msgs={msgs} network={network} chain={chain} client={client} />
      </Box>
    </Box>
  );
};

export default BondForm;
