import {chakra, Box, Flex,  Link, Image, HStack,  Center} from "@chakra-ui/react";
import React, {FC} from "react";

import Header from "../common/components/Header";
import {SteakProps} from "../../pages/_app";
import {validator_credit} from "modules/constants";

function ValidatorLogoSingle({credit}: { credit: validator_credit }) {
    return (
        <Flex align="center">
            <Link target="_blank" href={credit.delegate_url}>
                <Image w={30} src={`/validator_logos/${credit.logo}.png`} alt={credit.name}/>{credit.name}
            </Link>
        </Flex>
    )
}

function ValidatorLogo({credit}: { credit: validator_credit }) {
    return (
        <Flex align="center">
            <Link target="_blank" href={credit.delegate_url}>
                <chakra.a><Image w={30} src={`/validator_logos/${credit.logo}.png`} alt={credit.name}/>{credit.name}
                </chakra.a>
            </Link>
        </Flex>
    )
}

const Credit: FC<SteakProps> = ({network}) => {

    return (
        <>
            <Header text="Credits">

            </Header>
            <Box color="black" bg="brand.lightBrown" py="4" mb="4" borderRadius="2xl" textAlign="center">
                <Box flex="1" color={"black"}>
                    Liquid Steaking is brought to you by&nbsp;
                    <Link target="_blank" href="https://twitter.com/arthuryeti">
                        <chakra.a>Arthur</chakra.a>
                    </Link>,&nbsp;
                    <Link target="_blank" href="https://twitter.com/larry0x">
                        <chakra.a>Larry</chakra.a>
                    </Link>,&nbsp;&amp;&nbsp;
                    <Link target="_blank" href="https://twitter.com/PFC_Validator">
                        <chakra.a>PFC</chakra.a>
                    </Link>.
                </Box>
                {network.validators.length > 1 && (
                    <Box flex="1" color={"black"}>
                        You can support future work by delegating to these validators on your network.
                        <HStack flex="1" spacing="6" justify="center" key="footer" p={3} align="center">
                            {network.validators.map((v) => <ValidatorLogo key={v.name} credit={v}/>)}
                        </HStack>
                    </Box>
                )}

                {network.validators.length == 1 && (<Box py="3">
                        <Center>    You can support future work by delegating to&nbsp;

                            <ValidatorLogoSingle
                        credit={network.validators[0]}/></Center></Box>
                )}
            </Box>
        </>
    );
};

export default Credit;
