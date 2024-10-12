import { getAuth,  signInWithPopup} from "firebase/auth";
import { provider } from "./utilities/firebase";
const LoginPage = ({setUid}) => {
    const auth = getAuth();
    const handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUid(user.uid);
                window.location.href = "/listings";
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