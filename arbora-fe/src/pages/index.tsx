import React from "react";
import {Route, Routes} from "react-router-dom";
import ArboraHomePage from "./home";
import ArboraLoginPage from "./login";

const AUTH_PAGES: string[] = [
    '/login',
]

export default function ArboraWebApp() {
    const [loading_user_data, setLoadingUserData] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (AUTH_PAGES.includes(window.location.pathname)) return
        setLoadingUserData(true)
        // fetch user data
        setLoadingUserData(false)
    }, []);

    return (
        !loading_user_data ? (
            <Routes>
                <Route path="/login" element={<ArboraLoginPage/>}/>
                <Route path="/" element={<ArboraHomePage/>}/>
            </Routes>
        ) : (
            <div>Loading...</div>
        )
    )
}