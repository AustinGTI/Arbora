import {useNavigate} from "react-router-dom";
import {Center, HStack, Text, VStack} from "@chakra-ui/react";
import PiCard from "../../pillars-ui/components/containers/cards/PiCard.tsx";
import LoginForm from "../../core/forms/LoginForm.tsx";
import {loginService} from "../../core/services/auth/AuthServices.ts";
import ArboraBanner from "../../core/graphics/ArboraBanner.tsx";
import ArboraLogo from "../../core/graphics/ArboraLogo.tsx";
import SignUpForm from "../../core/forms/SignUpForm.tsx";
import PiLayerContainer, {
    PiContainerLayer, PiLayerContainerContext
} from "../../pillars-ui/components/containers/dynamic-containers/PiLayerContainer.tsx";
import {createUserService, getCurrentUserService} from "../../core/services/users/UsersCRUDServices.ts";
import React from "react";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {BiChevronLeft} from "react-icons/bi";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {setUser} from "../../core/redux/auth/auth_slice.ts";
import {StandardConsole} from "../../core/helpers/logging.ts";
import {ARBORA_GREEN} from "../../core/constants/styling.ts";
import {useDispatch} from "react-redux";

function LoginFormLayer() {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    return (
        <VStack>
            <Text lineHeight={1} textDecoration={'underline'} fontSize={'30px'} color={ARBORA_GREEN.hard}
                  fontWeight={800}>LOGIN</Text>
            <LoginForm submitFunction={
                async (login_form_obj, setError) => {
                    const response = await loginService(login_form_obj)
                    // if successful, navigate to home page
                    if (response.is_successful) {
                        // fetch the current user
                        const user_response = await getCurrentUserService()
                        if (user_response.is_successful) {
                            dispatch(setUser(user_response.data.user))
                            navigate('/')
                        } else {
                            StandardConsole.error('Could not fetch user')
                        }
                    } else {
                        setError('password', {
                            type: 'custom',
                            message: response.error_message
                        })
                    }
                }}/>
        </VStack>
    )
}

function SignUpFormLayer() {
    const {navigation_props: {goToLayer}} = React.useContext(PiLayerContainerContext)

    return (
        <VStack>
            <HStack position={'relative'} w={'100%'} justify={'center'}>
                <PiButton
                    variant={PiButtonVariant.ICON}
                    icon={BiChevronLeft}
                    position={'absolute'} left={0}
                    onClick={() => goToLayer(LoginPageLayerKey.LOGIN_FORM)}
                />
                <Text lineHeight={1} textDecoration={'underline'} fontSize={'30px'} color={ARBORA_GREEN.hard}
                      fontWeight={800}>
                    SIGN UP
                </Text>
            </HStack>
            <SignUpForm submitFunction={
                async (signup_form_obj) => {
                    await createUserService(signup_form_obj).then((response) => {
                        if (response.is_successful) {
                            goToLayer(LoginPageLayerKey.LOGIN_FORM)
                        }
                    })
                }
            }/>
        </VStack>
    )
}

export enum LoginPageLayerKey {
    LOGIN_FORM = 'login_form',
    SIGNUP_FORM = 'signup_form'
}

const LOGIN_PAGE_LAYERS: PiContainerLayer[] = [
    {
        key: LoginPageLayerKey.LOGIN_FORM,
        content: <LoginFormLayer/>
    },
    {
        key: LoginPageLayerKey.SIGNUP_FORM,
        content: <SignUpFormLayer/>
    }
]

export default function ArboraLoginPage() {

    return (
        <Center position={'absolute'} top={0} left={0} bg={ARBORA_GREEN.soft} w={'100vw'} h={'100vh'} p={0} m={0}>
            <VStack>
                <VStack pb={'0.5rem'}>
                    <ArboraLogo size={'70px'}/>
                    <ArboraBanner size={'63px'}/>
                </VStack>
                <PiCard bg={ARBORA_GREEN.fg} w={'25rem'} py={'1.5rem'}>
                    <PiLayerContainer layers={LOGIN_PAGE_LAYERS} container_data_context={{}}/>
                </PiCard>
            </VStack>
        </Center>
    )
}