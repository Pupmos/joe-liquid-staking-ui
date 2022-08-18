import { Box, Table, Thead, Tbody, Tr, Th,Text } from "@chakra-ui/react";
import { FC } from "react";

import { UnbondQueueItem, UnbondQueueEmpty } from "./UnbondQueueItem";

import {  useWallet } from "@wizard-ui/react";
import Header from "modules/common/components/Header";
import {
  UnbondRequestsByUserResponseItem,
  usePendingBatch,
  useUnbondRequests,
} from "../../hooks";
import { SteakProps } from "../../pages/_app";

const UnbondQueue: FC<SteakProps> = ({ network,chain,client})=> {
  const { address } = useWallet();
  const pendingBatch = usePendingBatch({client, hub:network.hub });
  const unbondRequests = useUnbondRequests({client, hub:network.hub, address });
 // const x =useUnbondRequestsHydrated({client, hub:network.hub, address });

  if (unbondRequests.isLoading || pendingBatch.isLoading) {
    return (<Header text="Loading..." />);
  }
  if (unbondRequests.isError || pendingBatch.isError) {
    if (pendingBatch.isError) {
      console.log("PB Err", pendingBatch.error, pendingBatch.status);
      return (<><Header text="PB Error..." /><Text>{pendingBatch.isError}</Text></>);
    } else {
      console.log("UB Err", unbondRequests.error, unbondRequests.status);
      return (<Header text="Error..." />);
    }

  }
  if (!unbondRequests.data) {
    return (<Header text="Nothiss" />);
  }
  //console.log("unbond reqs", x.data);
  const items = unbondRequests.data.length > 0
    ? (
      unbondRequests.data.map((unbondRequest: UnbondRequestsByUserResponseItem, index: number) => <UnbondQueueItem
        key={index} pending_batch={pendingBatch.data} {...unbondRequest} network={network} chain={chain} client={client} />)
    )
    : (
      <UnbondQueueEmpty />
    );

  return (
    <>
      <Header text="My Unbonding Requests" pb="1" />
      <Box overflowX="auto">
        <Table style={{ borderCollapse: "separate", borderSpacing: "0 0.6rem" }}>
          <Thead>
            <Tr>
              <Th borderBottom="none" bg="brand.darkBrown" color="white" borderLeftRadius="2xl">
                Status
              </Th>
              <Th borderBottom="none" bg="brand.darkBrown" color="white">
                Amount
              </Th>
              <Th borderBottom="none" bg="brand.darkBrown" color="white">
                Start Time
              </Th>
              <Th borderBottom="none" bg="brand.darkBrown" color="white" borderRightRadius="2xl">
                Est. Finish Time
              </Th>
            </Tr>
          </Thead>
          <Tbody>{items}</Tbody>
        </Table>
      </Box>
    </>
  );
};

export default UnbondQueue;
