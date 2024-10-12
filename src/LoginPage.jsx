import { getAuth,  signInWithPopup} from "firebase/auth";
import { provider } from "./utilities/firebase";
import { useNavigate } from "react-router-dom";
const LoginPage = ({setUid}) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUid(user.uid);
                navigate("/profile");
            })
            .catch((error) => {
                console.error("Error creating account", error);
            })
    }
    return (
        <div>
            <button onClick={() => handleSignIn()}> sign in with google</button>
        </div>
    )
}

export default LoginPage