import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { formatNumber } from "modules/util/conversion";

type Props = {
  assetSymbol: string;
  assetLogo: string;
  price?: number;
  balance?: number;
  isEditable?: boolean; // important
  fixedAmount?: number; // must supply if `isEditable` is set to false
  onAmountChange?: (newAmount: number) => void;
};

const AssetInput: FC<Props> = ({
  assetSymbol,
  assetLogo,
  price = 0,
  balance = 0,
  isEditable = true,
  fixedAmount,
  onAmountChange = () => {},
}) => {
  const [amount, setAmount] = useState<number | undefined>();
  // const amount = fixedAmount;
  // const setAmount = onAmountChange;

  const maxBtn = 
    <Button
      disabled={isEditable ? false : true}
      style={
        isEditable ? {  } : { visibility: 'hidden', pointerEvents: 'none' }
      }
      type="button"
      variant="mini"
      size={'xs'}
      bg={isEditable ? "gray.800" : "gray.900"}
      onClick={() => {
        onAmountChange(balance);
        setAmount(balance);
      }}
      isDisabled={false}
    >
      Max
    </Button>

  return (
    <Box bg="gray.700" borderRadius="2xl" p="6" mb="2">
      <Flex direction={["column", null, "row"]}>
        <Box flex="1">
          <Box
            bg="gray.800"
            color="white"
            display="flex"
            borderRadius="full"
            textAlign="left"
            px="4"
            h="16"
            lineHeight="1.2"
          >
            <Flex align="center">
              <Box>
                <Image src={assetLogo} borderRadius={10000} padding={0.5} border='1px solid white' alt="Logo" width="45px" height="45px" />
              </Box>
              <Box ml="3" flex="1">
                <Text fontSize="2xl">{assetSymbol}</Text>
                <Text fontSize="sm">Price: ${formatNumber(price, 2)}</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box flex="1" ml={[null, null, "8"]}  mt={["4", null, "0"]}>
          <NumberInput
            value={fixedAmount ?? amount} // if no external fixed amount is set, then use the internal amount
            min={0}
            max={isEditable ? balance : undefined} // if not editable, then do not set a max
            precision={6}
            onChange={(value: string) => {
              const numeric = Number(value);
              onAmountChange(numeric);
              setAmount(numeric);
            }}
            isDisabled={!isEditable}
            clampValueOnBlur={true}
            borderLeft='none'
          >
            <NumberInputField
              h="16"
              bg="gray.800"
              fontSize="2xl"
              textAlign="right"
              p="4"
              pt="0"
              placeholder="0.0"
              color="gray.200"
              _placeholder={{
                color: "gray.200",
              }}
              _disabled={{
                bg: "gray.700",
                borderColor: "gray.500",
                opacity: "1.0",
                cursor: "not-allowed",
              }}
            />
            <Box position="absolute" bottom="2" right="1.1rem">
              <Text color='gray.500' fontSize="small">${formatNumber(price * (fixedAmount ?? (amount || 0)), 2)}</Text>
            </Box>
          </NumberInput>
          <Flex align="center" justify="space-between" mt="1"  color="white">
            <HStack spacing="4" >
              <Text variant="dimmed" fontSize="sm">
                In Wallet:
              </Text>
              <Text fontSize="sm" ml="2">
                {formatNumber(balance, 3)}
              </Text>
            </HStack>
            <Box>{maxBtn}</Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default AssetInput;
