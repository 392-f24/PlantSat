import React, { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { database } from "./utilities/firebase";
import "./ListingsPage.css"; // Include your custom CSS for this page
import PlantDetails from "./PlantDetails";
import { useNavigate } from "react-router-dom";

const ListingsPage = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Load plant postings from database
  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `plants`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const plantsArray = Object.values(data);
          setPlants(plantsArray);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleMoreDetails = (plant) => {
    setSelectedPlant(plant);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPlant(null);
  };

  return (
    <div className="listings-container">
      <div className="listings-column">
        <h1 className="page-title">
          PLANTSAT
          <button className="post-button" onClick={() => navigate('/posting')}>
            Post
          </button>
        </h1>
        <p>200+ plants needing homes</p>
        {plants.map((plant) => (
          <div key={plant.name} className="plant-card">
            <img src={plant.imageUrl} alt={plant.name} className="listings-plant-image" />
            <div className="plant-info">
              <h2>{plant.name}</h2>
              <p>{plant.location && <em>{plant.location}</em>}</p>
              <p>{plant.duration}</p>
              <p>{plant.care}</p>
              <p>
                <strong>{plant.rating} ⭐</strong> ({plant.reviews} reviews)
              </p>
            </div>
            <div className="plant-action">
              <p className="price">${plant.price} /week</p>
              <button className="favorite-btn">
                {plant.favorite ? "❤️" : "🤍"}
              </button>
              <button className="details-btn" onClick={() => handleMoreDetails(plant)}>
                Book / More Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="map-column">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450961!2d144.95373631550455!3d-37.8162797420218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57745cd8eddfd55!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1631094448985!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {showPopup && (
        <PlantDetails plant={selectedPlant} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ListingsPage;
