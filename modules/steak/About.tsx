import {Box, Flex, Link, ListItem, UnorderedList, Text} from "@chakra-ui/react";
import {FC} from "react";
import ExternalLinkIcon from "modules/common/components/Icons/ExternalLinkIcon";
import {SteakProps} from "../../pages/_app";
import Header from "modules/common/components/Header";
import {convertFromMicroDenom, formatPercentage} from "modules/util/conversion";
import {useConfig} from "../../hooks";


function ExternalLinkIconWrapper() {
    return <ExternalLinkIcon ml="1" mr="6" transform="translateY(-2px)"/>;
}

const About: FC<SteakProps> = ({network, client}) => {
    const config = useConfig({client, hub: network.hub})
    if (config.isLoading || config.isError) {
        return <div>Loading...</div>
    }
    const fees = Number(config.data.fee_rate);
    const maxfee = Number(config.data.max_fee_rate);
    return (
        <>
            <Header text="About"/>
            <Box bg="white" p="6" mb="4" borderRadius="2xl">
                <Text mb="3">
                    <b>Pupjoes</b> is a liquid staking protocol for the {network.name}.
                </Text>
                <Text mb="3">
                    Users stake {convertFromMicroDenom(network.denom)} through the <b>Pupjoes Hub</b> smart contract,
                    which in return mints 🥩
                    WETJOE tokens to the users representing their staked amount. Every 24–48 hours, the staking
                    rewards are claimed and reinvested. As yield accrues, the exchange ratio between WETJOE and
                    {convertFromMicroDenom(network.denom)} tokens changes, with each unit of WETJOE becoming worth
                    more {convertFromMicroDenom(network.denom)} over time.
                </Text>
                <Text>
                    Compared to similar protocols such as Lido and Stader, WetJoe&rsquo;s unique features
                    include:
                </Text>
                <UnorderedList mb="6">
                    <ListItem>
                        <b>Delegated Proof of Work</b>
                    </ListItem>
                    {maxfee == 0 &&
                        <ListItem>
                            <b>Zero fee or commission</b>
                        </ListItem>
                    } {maxfee != 0 &&
                    <ListItem>
                        <b>{formatPercentage(fees)} capped at {formatPercentage(maxfee)} fees of commission earned</b>,
                        used to pay for the running of Pupjoes
                    </ListItem>

                }
                    <ListItem>
                        <b>no</b> useless governance token to siphon value from users
                    </ListItem>
                    <ListItem>
                        <b>Zero money raised from VCs;</b> developers worked completely voluntarily, paying for
                        expenses out of their own pockets
                    </ListItem>
                    <ListItem>
                        <b>Committed to support non-institution, community-based validators,</b> especially
                        those who contribute to open source projects, run bare metal servers (instead of
                        cloud-based ones), and provide crucial infrastructure services for the Cosmos ecosystem
                        (e.g. IBC message relaying)
                    </ListItem>
                </UnorderedList>
                <hr/>
                <Box mt="6" mb="1">
                    <b>Useful links</b>
                </Box>
                <Flex direction={["column", null, "row", null]} mb="1">
                    <Link
                        variant="docs"
                        isExternal={true}
                        href="https://github.com/PFC-Developer/steak-contracts"
                    >
                        Smart contract source code <ExternalLinkIconWrapper/>
                    </Link>{/*}
                    <Link variant="docs" isExternal={true}
                          href="https://github.com/PFC-developer/steak-webapp/tree/chore_upgrade_terra2.0">
                        Webapp source code <ExternalLinkIconWrapper/>
                    </Link>*/}
                    <Link
                        variant="docs"
                        isExternal={true}
                        href="https://github.com/SCV-Security/PublicReports/blob/main/CW/St4k3h0us3/St4k3h0us3%20-%20Steak%20Contracts%20Audit%20Review%20-%20%20v1.0.pdf"
                    >
                        Audit report by SCV (for v1.0)<ExternalLinkIconWrapper/>
                    </Link>
                </Flex>
                <Flex direction={["column", null, "row", null]}>
                    <Link
                        variant="docs"
                        isExternal={true}
                        href={`${network.contract_explorer}${network.hub}`}
                    >
                        WetJoe Hub contract <ExternalLinkIconWrapper/>
                    </Link>
                    <Link
                        variant="docs"
                        isExternal={true}
                        href={`${network.contract_explorer}${network.steak}`}
                    >
                        WETJOE Token contract <ExternalLinkIconWrapper/>
                    </Link>
                </Flex>
                <Flex direction={["column", null, "row", null]}>
                    STEAK-{convertFromMicroDenom(network.denom)} Pairs
                    (<Link
                    variant="docs"
                    isExternal={true}
                    href="#"
                >
                    LP (TBD) <ExternalLinkIconWrapper/>
                </Link> /
                    )
                </Flex>
            </Box>
        </>
    );
};

export default About;
