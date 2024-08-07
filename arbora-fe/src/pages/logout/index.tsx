import {Center, VStack} from "@chakra-ui/react";
import PiPlainText from "../../pillars-ui/components/text/PiPlainText.tsx";
import React from "react";
import {useDispatch} from "react-redux";
import {clearAuth} from "../../core/redux/auth/auth_slice.ts";
import {useNavigate} from "react-router-dom";
import {ARBORA_GREEN} from "../../core/constants/styling.ts";
import TreeAnimationLoader from "../../core/graphics/loaders/TreeAnimationLoader.tsx";

const LOGOUT_DELAY = 3000

export default function ArboraLogoutPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // in the logout page, we clear the user and access token from the redux store and redirect to the login page

    React.useEffect(() => {
        setTimeout(() => {
            dispatch(clearAuth())
            navigate('/login')
        }, LOGOUT_DELAY)
    }, []);

    return (
        <Center position={'absolute'} top={0} left={0} bg={ARBORA_GREEN.bg} w={'100vw'} h={'100vh'} p={0} m={0}>
            <VStack>
                <TreeAnimationLoader tree_size={50} text={'Logging out'}/>
                <PiPlainText value={'Come back soon :)'} fontWeight={600}/>
            </VStack>
        </Center>
    )
}