import './App.css'
import GlobalProvider from "./core/redux";
import ArboraWebApp from "./pages";
import Pillars from "./pillars-ui";
import {ChakraProvider} from "@chakra-ui/react";

function App() {
    return (
        <GlobalProvider>
            <ChakraProvider>
                <Pillars>
                    <ArboraWebApp/>
                </Pillars>
            </ChakraProvider>
        </GlobalProvider>
    )
}

export default App
