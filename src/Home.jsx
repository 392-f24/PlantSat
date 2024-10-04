import React from "react";
import "./Home.css"; // Add your CSS for styling

const Home = () => {
const navigateToListings = () => {
    window.location.href = "/listings";
};

return (
    <div className="home-container">
        <h1 className="title">WELCOME TO PLANTSAT</h1>
        <div className="plant-image">
            {/* You can replace this img src with the actual URL of your plant image */}
            <img src="/homeplant.svg" alt="Plants" />
        </div>
        <button className="get-started-button" onClick={navigateToListings}>
            GET STARTED{" "}
            <span role="img" aria-label="plant emoji">
                🌱
            </span>
        </button>
    </div>
);
};

export default Home;
