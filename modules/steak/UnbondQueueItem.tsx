import { chakra, Tr, Td, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";
import {
  PendingBatchResponse, PreviousBatchResponse,
  UnbondRequestsByUserResponseItem, useConfig,
  usePreviousBatch
} from "../../hooks";
import { capitalizeFirstLetter, convertFromMicroDenom, formatNumber } from "modules/util/conversion";
import { SteakProps } from "../../pages/_app";

const UnbondQueueEmpty: FC = () => {
  return (
    <Tr bg="white" mb="2">
      <Td colSpan={4} py="6" textAlign="center" borderBottom="none" borderRadius="2xl">
        No active unbonding request
      </Td>
    </Tr>
  );
};

interface UnbondQueueItem extends UnbondRequestsByUserResponseItem, SteakProps {
  pending_batch: PendingBatchResponse;
}

const UnbondQueueItem: FC<UnbondQueueItem> = ({ pending_batch, id, shares, network, client }) => {
  const config = useConfig({ client, hub: network.hub });
  const previous_batch = usePreviousBatch({ client, hub: network.hub, id });
  if (config.isLoading) {
    return (<Tr bg="white"><Td>Loading...</Td></Tr>);
  }

  if (config.isError) {
    console.log("config", config, config.isError);
    return (<Tr bg="red"><Td>Error...</Td></Tr>);
  }

  let { status, amount } = { status: "asd", amount: 1 };

  let startTime: Date;
  let finishTime: Date;
  if (pending_batch.id === id) {
    status = "pending";
    amount = Number(pending_batch.usteak_to_burn);
    startTime = new Date(pending_batch.est_unbond_start_time * 1000);
    finishTime = new Date((pending_batch.est_unbond_start_time + config.data.unbond_period) * 1000);

  } else {
    if (previous_batch.isLoading) {
      return (<Tr bg="white"><Td>Loading...</Td></Tr>);
    }
    if (previous_batch.isError) {
      console.log("previous_batch ERR - ID=", id, previous_batch, previous_batch.isError, previous_batch.error);
    }
    const batch: PreviousBatchResponse = previous_batch.data;
    const currentTime = new Date();

    startTime = new Date((batch.est_unbond_end_time - config.data.unbond_period) * 1000);
    finishTime = new Date(batch.est_unbond_end_time * 1000);
    if (currentTime > finishTime) {
      status = "completed";
    } else {
      status = "unbonding";
    }
    amount = (Number(batch.amount_unclaimed) * Number(shares)) /
      Number(batch.total_shares);
  }
  const finishTimeItem =
    status === "completed" ? (
      <NextLink href="/withdraw" passHref>
        <chakra.a
          transition="0.2s all"
          outline="none"
          border="solid 2px #d9474b"
          borderRadius="md"
          color="white"
          bg="brand.red"
          px="10"
          py="2"
          _hover={{
            color: "brand.red",
            bg: "white",
            textDecoration: "none"
          }}
        >
          Claim {convertFromMicroDenom(network.denom)}
        </chakra.a>
      </NextLink>
    ) : (
      <Text>{finishTime.toLocaleString()}</Text>
    );

  return (
    <Tr transition="0.25s all" bg="white" mb="2" _hover={{ bg: "gray.100" }}>
      <Td borderBottom="none" py="6" borderLeftRadius="2xl">
        {capitalizeFirstLetter(status)}
      </Td>
      <Td borderBottom="none" py="6" minW="200px">
        {formatNumber(amount / 1e6, 6) + (status === "pending" ? " STEAK" : ` ${convertFromMicroDenom(network.denom)}`)}
      </Td>
      <Td borderBottom="none" py="6" minW="270px">
        {startTime.toLocaleString()}
      </Td>
      <Td borderBottom="none" py="6" minW="270px" borderRightRadius="2xl">
        {finishTimeItem}
      </Td>
    </Tr>
  );
};

export { UnbondQueueItem, UnbondQueueEmpty };
