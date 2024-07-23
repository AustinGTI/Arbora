import {useNavigate} from "react-router-dom";

export default function ArboraLoginPage() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Login</h1>
            <button onClick={() => {
                navigate('/')
            }}>login
            </button>
        </div>
    )
}