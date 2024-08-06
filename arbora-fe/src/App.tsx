import './App.css'
import './core/markdown/markdown-editor-styling.scss'
import GlobalProvider from "./core/redux";
import ArboraWebApp from "./pages";
import Pillars from "./pillars-ui";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";

/// <reference types="vite-plugin-svgr/client" />

const APP_THEME = extendTheme({
    fonts: {
        body: 'Quicksand',
        heading: 'Quicksand',
    },
    colors: {
        green: {
            100: '#F0FFF0',
            300: '#A8E4A0',
            500: '#5E8248',
        }
    }
})

function App() {
    return (
        <GlobalProvider>
            <ChakraProvider theme={APP_THEME}>
                <Pillars>
                    <ArboraWebApp/>
                </Pillars>
            </ChakraProvider>
        </GlobalProvider>
    )
}

export default App
