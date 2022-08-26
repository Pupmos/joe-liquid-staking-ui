import {SimpleGrid} from "@chakra-ui/react";
import {FC} from "react";

import OverviewItem from "./OverviewItem";
import Header from "modules/common/components/Header";
import {convertFromMicroDenom, formatNumber} from "modules/util/conversion";
import {useHubState} from "../../hooks";
import {SteakProps} from "../../pages/_app";

const Overview: FC<SteakProps> = ({network, client}) => {

    const hubState = useHubState({client, hub: network.hub})
    if (hubState.isLoading) {
        return <div>Loading</div>
    }
    if (hubState.isError) {
        console.log('hubstate',hubState.error )
        return <div>Error</div>
    }

    const exchangeRate = hubState.data ? hubState.data.exchange_rate : 1;
    const totalNativeLocked = hubState.data ? hubState.data.total_native : 0;
    // const totalValueLocked = store.priceLunaUsd ? totalLunaLocked * store.priceLunaUsd : 0;

    return (
        <>
            <Header text="Overview"/>
            <SimpleGrid minChildWidth="250px" spacing="10px" mb="4">
                <OverviewItem
                    primaryText={`(${formatNumber(totalNativeLocked / 1e6, 0)} ${convertFromMicroDenom(network.denom)})`}
                    secondaryText="price coming soon"
                    additionalText="Total value locked"
                />
                <OverviewItem
                    primaryText={formatNumber(exchangeRate, 6)}
                    secondaryText={`${convertFromMicroDenom(network.denom)} per STEAK`}
                    additionalText="Exchange ratio"
                />
                <OverviewItem primaryText="TBD" secondaryText="_" additionalText="Current APY"/>
            </SimpleGrid>
        </>
    );
};

export default Overview;
