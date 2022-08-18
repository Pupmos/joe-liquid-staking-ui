import {  Link, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { SteakProps } from "../../../../pages/_app";
import AstroportIcon from "modules/steak/chains/terra/AstroportIcon";


const TerraMySteak: FC<SteakProps> = ({ network }) => {

  return (
    <Link
      variant="submit"
      isExternal={true}
      href={`https://app.astroport.fi/swap?from=${network.denom}&to=${network.hub}`}
    >
      <Flex
        display={["none", "flex", null, null]}
        w="100%"
        h="100%"
        justify="center"
        align="center"
      >
        <AstroportIcon w="1.6rem" h="1.6rem" ml="2" mr="1" /> Astroport
      </Flex>
    </Link>
  );
};

export { TerraMySteak };
