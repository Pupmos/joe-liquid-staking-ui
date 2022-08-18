import React, { FC } from "react";
import { useBalance, useWallet, WalletModalButton } from "@wizard-ui/react";
import { truncate } from "@wizard-ui/core";
import {
  HStack,
  // useDisclosure,
  Box,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { ChevronDown as ChevronDownIcon, Bell as BellIcon } from "lucide-react";


import { convertFromMicroDenom, convertMicroDenomToDenom } from "modules/util/conversion";
import { SteakProps } from "../../../pages/_app";

export const CosmosWallet: FC<SteakProps> = ({ network }) => {
//  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useWallet();
  const { data, isError, isLoading } = useBalance({ address, token: network.denom });
  const steakBalance = useBalance({ address, token: network.steak });
  if (address != null) {
    return (
      <Box>
        <HStack spacing="3">
          <IconButton
            aria-label="notifications"
            icon={<BellIcon size="1rem" />}
          />
          <Menu placement="bottom-end">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon size="1rem" />}>
              {truncate(address)}
            </MenuButton>
            <MenuList>
              {isLoading && <MenuItem>Balance Loading...</MenuItem>}
              {isError && <MenuItem>Balance Error...</MenuItem>}
              {!isError && !isLoading &&
                <MenuItem>{convertFromMicroDenom(network.denom)} {convertMicroDenomToDenom(data)}</MenuItem>}
              {steakBalance.isLoading && <MenuItem>Steak Balance Loading...</MenuItem>}
              {steakBalance.isError && <MenuItem>Steak Balance Error...</MenuItem>}
              {!steakBalance.isError && !steakBalance.isLoading &&
                <MenuItem>Steak: {convertMicroDenomToDenom(steakBalance.data)}</MenuItem>}

              <MenuItem>Copy Address</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
    );
  }

  return <WalletModalButton />;
};
