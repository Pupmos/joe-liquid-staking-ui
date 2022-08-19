import {Link, Tr, Td, Text, HStack, Image} from "@chakra-ui/react";
import {FC} from "react";
import {Validator} from "../../hooks";
import {formatNumber, formatPercentage} from "modules/util/conversion";
import {chain_details} from "modules/constants";

export interface ValidatorProps {
    validator: Validator;
    network: chain_details
}

const ValidatorItem: FC<ValidatorProps> = ({validator, network}) => {

    const isActive = validator.status === "BOND_STATUS_BONDED" && !validator.jailed;
    return (
        <Tr transition="0.25s all" bg="white" mb="2" _hover={{bg: "gray.100"}}>
            <Td borderBottom="none" py="3" borderLeftRadius="2xl">
                <HStack>
                    <Image
                        src={`/${validator.description.identity}.jpeg`}
                        alt={validator.description.identity}
                        h="2rem"
                        w="2rem"
                        mr="1"
                        borderRadius="full"
                        onError={({currentTarget}) => {
                            currentTarget.src = "/nopic.jpeg";
                        }}
                    />
                    <Link
                        href={`${network.validator_explorer}/${validator.operator_address}`}
                        isExternal={true}
                        mr="1"
                        whiteSpace="nowrap"
                        textUnderlineOffset="0.3rem"
                    >
                        {validator.description.moniker}
                    </Link>
                </HStack>
            </Td>
            <Td borderBottom="none" py="3">
                <Text
                    bg={isActive ? "green.300" : "red"}
                    p="1"
                    textAlign="center"
                    textStyle="minibutton"
                    letterSpacing="wider"
                    borderRadius="md"
                >
                    {isActive ? "active" : "inactive"}
                </Text>
            </Td>
            <Td borderBottom="none" py="3">
                <HStack>
                    <Text>{formatNumber(Number(validator.tokens) / 1e6, 0)}</Text>
                    <Image src={`/${network.denom}.png`} w="1rem" h="1rem"/>
                </HStack>
            </Td>
            <Td borderBottom="none" py="3" borderRightRadius="2xl">
                {formatPercentage(Number(validator.commission.commission_rates.rate))}
            </Td>

        </Tr>
    );
};

export default ValidatorItem;
