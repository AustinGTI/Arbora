import {useNavigate} from "react-router-dom";
import {Box, Text, Center, HStack, VStack} from "@chakra-ui/react";
import ArboraLogo from "../../core/graphics/ArboraLogo.tsx";
import ArboraBanner from "../../core/graphics/ArboraBanner.tsx";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {BiExit} from "react-icons/bi";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {useSelector} from "react-redux";
import {StandardConsole} from "../../core/helpers/logging.ts";

export default function ArboraHomePage() {
    const auth_data = useSelector(state => state.auth)
    const navigate = useNavigate()

    StandardConsole.log('auth data is', auth_data)

    return (
        <Box position={'absolute'} top={0} left={0} bg={'green.300'} w={'100vw'} h={'100vh'} p={0} m={0}>
            <VStack w={'100%'} h={'100%'}>
                <HStack w={'100%'} h={'100px'} align={'flex-end'} px={'1rem'}>
                    <ArboraLogo size={'65px'}/>
                    <HStack flex={1} px={'1rem'} justify={'space-between'} align={'center'}>
                        <ArboraBanner size={'63px'}/>
                        <PiButton
                            variant={PiButtonVariant.ICON}
                            icon={BiExit} icon_props={{fontSize: '40px'}}
                            onClick={() => navigate('/login')}/>
                    </HStack>
                </HStack>
                <Center paddingTop={'20vh'}>
                    <Text fontSize={'70px'}>Hello {auth_data?.user?.name ?? 'Stranger'}!</Text>
                </Center>
            </VStack>
        </Box>
    )
}
