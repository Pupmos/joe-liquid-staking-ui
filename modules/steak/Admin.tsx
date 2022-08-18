import { Box, Flex, Text, Button, useDisclosure} from "@chakra-ui/react";
import {FC, useState} from "react";

import Header from "../common/components/Header";
import { useWallet} from "@wizard-ui/react";
import {SteakProps} from "../../pages/_app";
import {EncodeObject} from "@cosmjs/proto-signing";
import {MsgExecuteContract} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import {toUtf8} from "@cosmjs/encoding";
import TxModal from "modules/common/components/TxModal";


const MySteak: FC<SteakProps> = ({network, chain, client}) => {
    const {address} = useWallet();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [msgs, setMsgs] = useState<EncodeObject[]>([]);
    if (!address) {
        return (<Header text="Please Connect"/>);
    }
    const rebalanceMsgs: EncodeObject[] = [];
    if (address && network.hub) {

        // const rebalanceMsg = {rebalance: {minimum:"3000000"}}; // 3 native
        const rebalanceMsg = {rebalance: {minimum: "100000000"}}; // 100 native
        rebalanceMsgs.push(
            {
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: MsgExecuteContract.fromPartial({
                    sender: address,
                    contract: network.hub,
                    msg: toUtf8(JSON.stringify(rebalanceMsg))
                })
            }
        );
    }
    const harvestMsgs: EncodeObject[] = [];
    if (address && network.hub) {

        const harvestMsg = {harvest: {}};
        harvestMsgs.push(
            {
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: MsgExecuteContract.fromPartial({
                    sender: address,
                    contract: network.hub,
                    msg: toUtf8(JSON.stringify(harvestMsg))
                })
            }
        );
    }
    const submitBatchMsgs: EncodeObject[] = [];
    if (address && network.hub) {

        const submitBatchMsg = {submit_batch: {}};
        submitBatchMsgs.push(
            {
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: MsgExecuteContract.fromPartial({
                    sender: address,
                    contract: network.hub,
                    msg: toUtf8(JSON.stringify(submitBatchMsg))
                })
            }
        );
    }

    return (
        <>
            <Header text="Admin Functions">

                &nbsp;

            </Header>
            <Box color="white" bg="brand.lightBrown" p="12" mb="4" borderRadius="2xl" textAlign="center">
                <Flex direction={["column", "row", null, null]} justify="center" mt="10">
                    <Button
                        type="button"
                        variant="solid"
                        mt="6"
                        onClick={() => {
                            setMsgs(harvestMsgs);
                            return onOpen()
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
                            return onOpen()
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
                            return onOpen()
                        }}
                        isLoading={false}
                        isDisabled={!address}
                    >
                        Submit Batch
                    </Button>

                </Flex>
            </Box>
            <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
                {""}
            </Text>
            <TxModal isOpen={isOpen} onClose={onClose} msgs={msgs} network={network} chain={chain} client={client}/>
        </>
    );
};

export default MySteak;
