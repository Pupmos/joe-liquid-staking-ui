import { Box, Button, Flex, Link, Spinner, Text } from "@chakra-ui/react";

import axios from "axios";
import { FC, useState, useEffect } from "react";

import ModalWrapper from "./ModalWrapper";
import SuccessIcon from "./Icons/SuccessIcon";
import FailedIcon from "./Icons/FailedIcon";
import ExternalLinkIcon from "./Icons/ExternalLinkIcon";

//import { useStore } from "../store";
import { EncodeObject } from "@cosmjs/proto-signing";
import { useWallet } from "@wizard-ui/react";
import { SteakProps } from "../../../pages/_app";

import { WalletSendTransactionError } from "@wizard-ui/core";
import { truncateString } from "modules/util/conversion";

/**
 * If tx is confirmed, should return an response in the following format:
 *
 * ```typescript
 * {
 *   tx: object;
 *   tx_response: object;
 * }
 * ```
 *
 * If not confirmed, the query either fail with error code 400, or return a response in the following format:
 *
 * ```typescript
 * {
 *   code: number;
 *   message: string;
 *   details: any[];
 * }
 * ```
 */
async function checkTxIsConfirmed(grpcGatewayUrl: string, txhash: string): Promise<boolean> {
  try {
    //const { data } = await axios.get(`${grpcGatewayUrl}/block_results?tx=${txhash}`);
    const { data } = await axios.get(`${grpcGatewayUrl}/cosmos/tx/v1beta1/txs/${txhash}`);
    if ("tx" in data) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function SpinnerWrapper() {
  return (
    <Spinner thickness="6px" speed="1s" emptyColor="transparent" color="brand.red" size="xl" />
  );
}

function TxHashText(tx_explorer: string, txhash: string) {
  return (
    <Flex>
      <Text variant="dimmed" ml="auto" mr="3">
        Tx Hash
      </Text>
      <Link
        isExternal
        href={`${tx_explorer}${txhash}`}
        ml="3"
        mr="auto"
        my="auto"
        textUnderlineOffset="0.3rem"
      >
        {truncateString(txhash, 6, 6)}
        <ExternalLinkIcon
          ml="2"
          style={{
            transform: "translateY(-2.4px)"
          }}
        />
      </Link>
    </Flex>
  );
}

function TxFailedText(error: any) {
  if (error instanceof WalletSendTransactionError) {
//    console.log('TX Error', error);
    return (
      <Flex>
        <Text variant="dimmed" ml="auto" mr="3">
          { error.name}
        </Text>
        <Text ml="3" mr="auto"><>
          {error.message}</>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex>
      <Text variant="dimmed" ml="auto" mr="3">
        Reason
      </Text>
      <Text ml="3" mr="auto">
        {error.toString()}
      </Text>
    </Flex>
  );
}

function CloseButton(showCloseBtn: boolean, onClick: () => void) {
  return showCloseBtn ? (
    <Button variant="primary" mt="12" onClick={onClick}>
      Close
    </Button>
  ) : null;
}

interface Props extends SteakProps {
  msgs: EncodeObject[];
  isOpen: boolean;
  onClose: () => void;
}

const TxModal: FC<Props> = ({ network, msgs, isOpen, onClose }) => {
  const { address, signingClient, wallet } = useWallet();
  const apiURL = network.api;
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false);
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<any>();
  const [txStatusHeader, setTxStatusHeader] = useState<string>();
  const [txStatusIcon, setTxStatusIcon] = useState<JSX.Element>();
  const [txStatusDetail, setTxStatusDetail] = useState<JSX.Element>();


  useEffect(() => {
    setTxConfirmed(false);
    setTxStatusHeader("Transaction Pending");
    setTxStatusIcon(SpinnerWrapper());
    setTxStatusDetail(<Text>Please confirm tx in wallet popup</Text>);
    setIntervalId(undefined);
    setTxResult(undefined);
    setShowCloseBtn(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && address) {
      //sendTransaction(msgs, gasOptions);
      setTxResult(undefined);
      debugger
      wallet
      signingClient?.signAndBroadcast(
        address,
        msgs,
       {
        gas: '2000000',
        amount: [{ denom: 'ujoe', amount: '10000000' }]
       }
      )
        .then((result) => {
          // console.log('tx result', result)
          setTxStatusHeader("Transaction Broadcasted");
          setTxStatusDetail(TxHashText(network.tx_explorer, result.transactionHash));
          setIntervalId(
            setInterval(() => {
              checkTxIsConfirmed(apiURL, result.transactionHash).then((txIsConfirmed) => {
                setTxResult(result);
                setTxConfirmed(txIsConfirmed);
              });
            }, 1000)
          );
        })
        .catch((error) => {
          setTxStatusHeader("Transaction Failed");
          setTxStatusIcon(<FailedIcon h="80px" w="80px" />);
          setTxStatusDetail(TxFailedText(error));
          setShowCloseBtn(true);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (txConfirmed) {
      if (txResult && txResult?.code && txResult?.code !== 0) {
        setTxStatusHeader("Transaction Failed");
        setTxStatusIcon(<FailedIcon h="80px" w="80px" />);
        setTxStatusDetail(TxFailedText(txResult?.rawLog));

      } else {
        setTxStatusHeader("Transaction Confirmed");
        setTxStatusIcon(<SuccessIcon h="80px" w="80px" />);
      }
      setShowCloseBtn(true);
      clearInterval(intervalId!);
      // TODO refresh queries
      // store.update(wallet);
    }
  }, [txConfirmed]);

  return (
    <ModalWrapper showHeader={false} isOpen={isOpen} onClose={onClose}>
      <Box w="100%" textAlign="center">
        <Text fontSize="xl" textStyle="minibutton" mt="10">
          {txStatusHeader}
        </Text>
        <Flex w="100%" h="150px" align="center" justify="center">
          {txStatusIcon}
        </Flex>
        <Box mt="3" mb="10">
          {txStatusDetail}
          {CloseButton(showCloseBtn, onClose)}
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default TxModal;
