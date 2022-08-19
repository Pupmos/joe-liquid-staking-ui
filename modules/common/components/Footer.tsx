import React from "react";
import {Flex, Box, HStack, chakra, } from "@chakra-ui/react";

import NextLink from "next/link";
import {SteakProps} from "../../../pages/_app";


export function Footer({}: SteakProps) {

    return (<>
            <Flex
                backdropFilter="blur(40px)"
                position="sticky"
                height="80px"
                top="0"
                align="center"
                p="20"
                zIndex="10"
                justify="space-between"
                borderBottom="1px solid #1c1c22"
            >
                <Box flex="1" color={"whiteAlpha.500"}>
                    <HStack flex="1" spacing="6" justify="flex" key="footer">
                        <NextLink href={"/admin"} passHref={true}>
                            <chakra.a>admin</chakra.a>
                        </NextLink>
                    </HStack>
                </Box>

            </Flex>
        </>
    );
}
