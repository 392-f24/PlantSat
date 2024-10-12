import React, { useState } from "react";
import "./Home.css"; // Add your CSS for styling
import { getAuth,  signInWithPopup} from "firebase/auth";
import { provider } from "./utilities/firebase";
import { useNavigate } from "react-router-dom";

const Home = ({uid, setUid}) => {

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
    const handleRedirect = () => {
        if (uid !== null) {
            window.location.href = "/listings";
        }
        else {
            handleSignIn();
        }
    };

    return (
        <div className="home-container">
            <h1 className="title">WELCOME TO PLANTSAT</h1>
            <div className="plant-image">
                {/* You can replace this img src with the actual URL of your plant image */}
                <img src="/homeplant.svg" alt="Plants" />
            </div>
            <button className="get-started-button" onClick={()=>handleRedirect()}>
                GET STARTED{" "}
                <span role="img" aria-label="plant emoji">
                    🌱
                </span>
            </button>
        </div>
    );
};

export default Home;
