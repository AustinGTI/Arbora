import './App.css'
import GlobalProvider from "./core/redux";
import ArboraWebApp from "./pages";

function App() {
    return (
        <GlobalProvider>
            <ArboraWebApp/>
        </GlobalProvider>
    )
}

export default App
