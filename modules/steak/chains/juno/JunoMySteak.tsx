import { Link, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { SteakProps } from "../../../../pages/_app";
import JunoSwapIcon from "modules/steak/chains/juno/JunoSwapIcon";
import JunoSwapText from "modules/steak/chains/juno/JunoSwapText";


const JunoMySteak: FC<SteakProps> = () => {
return (<></>);
/*
  return (
    <Link
      variant="submit"
      isExternal={true}
      bg={"black"}
      href='https://junoswap.com/swap?from=JUNO&to=STEAK'
    >
      <Flex
        display={["none", "flex", null, null]}
        w="100%"
        h="100%"
        justify="center"

        align="center"
      >
        <JunoSwapIcon w="1.6rem" h="1.6rem" ml="2" mr="1" /><JunoSwapText w="3.6rem" h="1.6rem" ml="2" mr="1" />
      </Flex>
    </Link>
  );

 */
};

export { JunoMySteak };
