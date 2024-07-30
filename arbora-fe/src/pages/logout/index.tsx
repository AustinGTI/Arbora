import {Center, VStack} from "@chakra-ui/react";
import PiPlainText from "../../pillars-ui/components/text/PiPlainText.tsx";
import React from "react";
import {useDispatch} from "react-redux";
import {clearAuth} from "../../core/redux/auth/auth_slice.ts";
import {useNavigate} from "react-router-dom";

const LOGOUT_DELAY = 2000

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
        <Center position={'absolute'} top={0} left={0} bg={'green.300'} w={'100vw'} h={'100vh'} p={0} m={0}>
            <VStack>
                <PiPlainText value={'Logging out...'} fontSize={'40px'}/>
                <PiPlainText value={'Come back soon :)'}/>
            </VStack>
        </Center>
    )
}