import {Box, Table, Thead, Tbody, Tr, Th} from "@chakra-ui/react";

import {FC} from "react";

import ValidatorsItem from "./ValidatorsItem";
import {SteakProps} from "../../pages/_app";
import Header from "modules/common/components/Header";
import {useConfig, useValidators, Validator} from "../../hooks";

const UnbondQueue: FC<SteakProps> = ({network, client}) => {
    const validators = useValidators({api: network.api});
    const hubConfig = useConfig({client: client, hub: network.hub});
    if (validators.isLoading || validators.isError || hubConfig.isLoading|| hubConfig.isError) {
        return (<div>Loading...</div>)
    }


    console.log('validators', validators.data);
    const items = validators.data.validators.filter( (v) => hubConfig.data.validators.includes( v.operator_address) ).map((validator: Validator, index) => <ValidatorsItem key={index}
                                                                                                  network={network}
                                                                                                  validator={validator}/>);

    return (
        <>
            <Header text="Whitelisted Validators" pb="1"/>
            <Box overflowX="auto">
                <Table style={{borderCollapse: "separate", borderSpacing: "0 0.6rem"}}>
                    <Thead>
                        <Tr>
                            <Th borderBottom="none" bg="brand.darkBrown" color="white" borderLeftRadius="2xl">
                                Validator
                            </Th>
                            <Th borderBottom="none" bg="brand.darkBrown" color="white">
                                Status
                            </Th>
                            <Th borderBottom="none" bg="brand.darkBrown" color="white">
                                Voting Power
                            </Th>
                            <Th borderBottom="none" bg="brand.darkBrown" color="white" borderRightRadius="2xl">
                                Commission
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>{items}</Tbody>

                </Table>
            </Box>
        </>
    );
};

export default UnbondQueue;
