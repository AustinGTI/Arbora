import {useNavigate} from "react-router-dom";

export default function ArboraHomePage() {
    const navigate = useNavigate()
    return (
        <div>
            <button
                onClick={() => {
                    navigate('/login')
                }}
            >logout
            </button>
            <h1>Home</h1>
        </div>
    )
}
