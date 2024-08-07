import React from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import ArboraHomePage from "./home";
import ArboraLoginPage from "./login";
import ArboraLogoutPage from "./logout";
import TreeAnimationLoader from "../core/graphics/loaders/TreeAnimationLoader.tsx";
import {getCurrentUserService} from "../core/services/users/UsersCRUDServices.ts";
import {useDispatch} from "react-redux";
import {logOutUser, setUser} from "../core/redux/auth/auth_slice.ts";
import useUserLoggedOut from "../core/redux/auth/hooks/useUserLoggedOut.tsx";
import {StandardConsole} from "../core/helpers/logging.ts";
import {ARBORA_GREEN} from "../core/constants/styling.ts";

const AUTH_PAGES: string[] = [
    '/login',
]

export default function ArboraWebApp() {
    const [loading_user_data, setLoadingUserData] = React.useState<boolean>(true)

    const dispatch = useDispatch()

    const user_logged_out = useUserLoggedOut()

    const navigate = useNavigate()
    React.useEffect(() => {
        if (AUTH_PAGES.includes(window.location.pathname)) return
        setLoadingUserData(true)
        // fetch user single_doc_section
        getCurrentUserService().then((response) => {
            if (response.is_successful) {
                dispatch(setUser(response.data.user))
            } else {
                StandardConsole.warn(`Could not fetch user data: ${response.error_message}`)
                dispatch(logOutUser())
            }
        }).catch((error) => {
            StandardConsole.warn(`Error ${error} on fetching user data, logging user out`)
            dispatch(logOutUser())
        }).finally(() => {
            setLoadingUserData(false)
        })
    }, []);

    React.useEffect(() => {
        if (AUTH_PAGES.includes(window.location.pathname)) return
        if (user_logged_out) {
            navigate('/login')
        }
    }, [user_logged_out]);

    return (
        !loading_user_data ? (
            <Routes>
                <Route path="/login" element={<ArboraLoginPage/>}/>
                <Route path="/" element={<ArboraHomePage/>}/>
                <Route path="/logout" element={<ArboraLogoutPage/>}/>
            </Routes>
        ) : (
            <TreeAnimationLoader text={'Planting Trees'} h={'100vh'} w={'100vw'} position={'absolute'} top={0} left={0} bg={ARBORA_GREEN.bg}/>
        )
    )
}