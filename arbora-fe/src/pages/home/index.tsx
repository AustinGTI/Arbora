import {useNavigate} from "react-router-dom";
import {Box, HStack, VStack} from "@chakra-ui/react";
import ArboraLogo from "../../core/graphics/ArboraLogo.tsx";
import ArboraBanner from "../../core/graphics/ArboraBanner.tsx";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {BiExit} from "react-icons/bi";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {StandardConsole} from "../../core/helpers/logging.ts";
import useGlobalAuthState from "../../core/redux/auth/useGlobalAuthState.tsx";
import {MarkdownEditor} from "../../core/components/MarkdownEditor.tsx";

export default function ArboraHomePage() {
    const auth_data = useGlobalAuthState()
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
                <Box w={'70%'} h={'70%'} marginTop={'5vh'} borderColor={'green.500'} borderWidth={'4px'}
                     borderRadius={'2rem'}>
                    <MarkdownEditor/>
                </Box>
            </VStack>
        </Box>
    )
}
