import { useDisclosure, Box, Button, Text } from "@chakra-ui/react";
import { FC } from "react";

import { SteakProps } from "../../pages/_app";
import Header from "modules/common/components/Header";
import AssetInput from "modules/common/components/AssetInput";
import TxModal from "modules/common/components/TxModal";
import { useBalance, useWallet } from "@wizard-ui/react";
import { convertFromMicroDenom } from "modules/util/conversion";
import {  useUnbondRequestsHydrated } from "../../hooks";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";

const WithdrawForm: FC<SteakProps> = ({ network, chain, client }) => {
  const { address } = useWallet();

  const prices = { steak: 0.0, native: 0.0 };
  const denomBalance = useBalance({ address, token: network.denom });
  const steakBalance = useBalance({ address, token: network.steak });

  const unbondRequests = useUnbondRequestsHydrated({ client, hub: network.hub,address });
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (steakBalance.isLoading || denomBalance.isLoading || unbondRequests.isLoading) {
    return <Text bg="white">Loading...</Text>;
  }
  if (steakBalance.isError || denomBalance.isError || unbondRequests.isError) {
    return <Text bg="white">Error...</Text>;
  }

  // Withdrawable amount is the sum of amounts in all *completed* bond requests
  const withdrawableAmount = unbondRequests.data.reduce(
    (a, b) => a + (b.status === "completed" ? b.amount : 0),
    0
  );


  // Need to reconcile if *any* of the *completed* batch is NOT reconciled

  const needToReconcile = unbondRequests.data
    .map((ubr) => ubr.status === "completed" && ubr.reconciled === false)
    .includes(true);

  const msgs: EncodeObject[] = [];
  if (address && network.hub) {

    if (needToReconcile) {
      const reconcileMsg ={reconcile:{}};
      msgs.push(
        {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: MsgExecuteContract.fromPartial({
            sender: address,
            contract: network.hub,
            msg: toUtf8(JSON.stringify(reconcileMsg))
          })
        }
      );
    }


    if (withdrawableAmount > 0) {
      const withdrawUnbondedMsg ={withdraw_unbonded:{}};
      msgs.push(
        {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: MsgExecuteContract.fromPartial({
            sender: address,
            contract: network.hub,
            msg: toUtf8(JSON.stringify(withdrawUnbondedMsg))
          })
        }
      );
    } else {
      console.log('Withdraw form: withdrawableAmount',withdrawableAmount)
    }
  } else {
    console.log('Withdraw form: address/hub not set?')
  }



  return (
    <Box maxW="container.sm" mx="auto">
      <Header text={`Withdrawable ${convertFromMicroDenom(network.denom)} Amount`} />
      <AssetInput
        assetSymbol={convertFromMicroDenom(network.denom)}
        assetLogo={`/${network.denom}.png`}
        price={prices.native}
        balance={!denomBalance.isLoading ? denomBalance.data / 1e6 : 0}
        isEditable={false}
        fixedAmount={withdrawableAmount / 1e6}
      />
      <Box textAlign="center">
        <Button
          type="button"
          variant="solid"
          mt="6"
          onClick={onOpen}
          isLoading={false}
          isDisabled={!address || withdrawableAmount == 0}
        >
          Withdraw
        </Button>
        <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
          {""}
        </Text>
        <TxModal isOpen={isOpen} onClose={onClose} msgs={msgs} network={network} chain={chain} client={client} />
      </Box>
    </Box>
  );
};

export default WithdrawForm;
