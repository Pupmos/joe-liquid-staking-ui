import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  Input,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { FC, useState } from "react";

import Header from "../common/components/Header";
import { useWallet } from "@wizard-ui/react";
import { SteakProps } from "../../pages/_app";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import TxModal from "modules/common/components/TxModal";
import { useConfig, useHubState, useValidators } from "hooks";

function addValidatorMsg(
  address: string,
  hub: string,
  valoper: string,
): EncodeObject[] {
  const messages: EncodeObject[] = [];
  const msg = { add_validator: { validator: valoper } };
  messages.push({
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender: address,
      contract: hub,
      msg: toUtf8(JSON.stringify(msg)),
    }),
  });
  return messages;
}
function removeValidatorMsg(
  address: string,
  hub: string,
  valoper: string,
): EncodeObject[] {
  const messages: EncodeObject[] = [];
  const msg = { remove_validator: { validator: valoper } };
  messages.push({
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender: address,
      contract: hub,
      msg: toUtf8(JSON.stringify(msg)),
    }),
  });
  return messages;
}

const MySteak: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [msgs, setMsgs] = useState<EncodeObject[]>([]);
  const [valoper, setValOper] = useState<string>();
  const validators = useValidators({ api: network.api });
  const config = useConfig({ client, hub: network.hub });
  if (!address) {
    return <Header text="Please Connect" />;
  }
  const rebalanceMsgs: EncodeObject[] = [];
  if (address && network.hub) {
    const rebalanceMsg = { rebalance: { minimum: "100000000" } }; // 100 native
    rebalanceMsgs.push({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract: network.hub,
        msg: toUtf8(JSON.stringify(rebalanceMsg)),
      }),
    });
  }
  const harvestMsgs: EncodeObject[] = [];
  if (address && network.hub) {
    const harvestMsg = { harvest: {} };
    harvestMsgs.push({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract: network.hub,
        msg: toUtf8(JSON.stringify(harvestMsg)),
      }),
    });
  }
  const submitBatchMsgs: EncodeObject[] = [];
  if (address && network.hub) {
    const submitBatchMsg = { submit_batch: {} };
    submitBatchMsgs.push({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract: network.hub,
        msg: toUtf8(JSON.stringify(submitBatchMsg)),
      }),
    });
  }

  return (
    <>
      <Header text="Admin Functions">&nbsp;</Header>
      <Box
        color="white"
        bg="brand.lightBrown"
        p="12"
        mb="4"
        borderRadius="2xl"
        textAlign="center"
      >
        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          mt="10"
        >
          <Button
            type="button"
            variant="solid"
            mt="6"
            onClick={() => {
              setMsgs(harvestMsgs);
              return onOpen();
            }}
            isLoading={false}
            isDisabled={!address}
          >
            Harvest
          </Button>{" "}
          <Button
            type="button"
            variant="solid"
            mt="6"
            onClick={() => {
              setMsgs(rebalanceMsgs);
              return onOpen();
            }}
            isLoading={false}
            isDisabled={!address}
          >
            Rebalance (100)
          </Button>{" "}
          <Button
            type="button"
            variant="solid"
            mt="6"
            onClick={() => {
              setMsgs(submitBatchMsgs);
              return onOpen();
            }}
            isLoading={false}
            isDisabled={!address}
          >
            Submit Batch
          </Button>
        </Flex>
        <Flex
          direction={["column", "row", null, null]}
          justify="center"
          align={'center'}
          mt="10"
        >
          <FormLabel color="black">Validator</FormLabel>
          <Select color='black' value={valoper} onChange={(e) => setValOper(e.target.value)}>
            <option value="">Select</option>
            {validators.data?.validators?.sort(
                (a, b) => +b.tokens - +a.tokens
            ).map((v, i) => (
              <option key={v.operator_address} value={v.operator_address}>
                {i + 1}. 
                {v.description.moniker}
                {" | "}
                {v.operator_address.slice(-6)}
                {config?.data?.validators.includes(v.operator_address)
                  ? " | (added)"
                  : "| (not added)"}
                  {v.status}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="solid"
            mt="6"
            onClick={() => {
              if (valoper) {
                setMsgs(addValidatorMsg(address, network.hub, valoper));
                return onOpen();
              }
            }}
            isLoading={false}
            isDisabled={!address || !valoper || valoper == ""}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="solid"
            mt="6"
            onClick={() => {
              if (valoper) {
                setMsgs(removeValidatorMsg(address, network.hub, valoper));
                return onOpen();
              }
            }}
            isLoading={false}
            isDisabled={!address || !valoper || valoper == ""}
          >
            Remove
          </Button>
        </Flex>
      </Box>
      <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
        {""}
      </Text>
      <TxModal
        isOpen={isOpen}
        onClose={onClose}
        msgs={msgs}
        network={network}
        chain={chain}
        client={client}
      />
    </>
  );
};

export default MySteak;
