import React, {Dispatch, SetStateAction} from "react";
import {Box, Container, Flex} from "@chakra-ui/react";

import {Navbar} from "modules/common";
import {SteakProps} from "../../../pages/_app";
import {Footer} from "modules/common/components/Footer";

interface LayoutProps extends SteakProps {
    children: React.ReactNode;
    chainId: string;
    setChain: Dispatch<SetStateAction<string>>
}

function Layout({children, network, setChain, chainId, client, chain}: LayoutProps) {
    return (
        <Flex minHeight="100vh" direction="column">
            <Container maxW="980px" mx="auto" mb="20">
                <Navbar network={network} setChain={setChain} chainId={chainId} client={client} chain={chain}/>
                <Box flex="1" p="4">
                    {children}

                </Box>
                <Footer />
            </Container>

        </Flex>
    );
}

export default Layout;
