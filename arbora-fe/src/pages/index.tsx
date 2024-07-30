import React from "react";
import {Route, Routes} from "react-router-dom";
import ArboraHomePage from "./home";
import ArboraLoginPage from "./login";
import ArboraLogoutPage from "./logout";

const AUTH_PAGES: string[] = [
    '/login',
]

export default function ArboraWebApp() {
    const [loading_user_data, setLoadingUserData] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (AUTH_PAGES.includes(window.location.pathname)) return
        setLoadingUserData(true)
        // fetch user single_doc_section
        setLoadingUserData(false)
    }, []);

    return (
        !loading_user_data ? (
            <Routes>
                <Route path="/login" element={<ArboraLoginPage/>}/>
                <Route path="/" element={<ArboraHomePage/>}/>
                <Route path="/logout" element={<ArboraLogoutPage/>}/>
            </Routes>
        ) : (
            <div>Loading...</div>
        )
    )
}