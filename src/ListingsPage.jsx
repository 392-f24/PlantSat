import React, { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { database } from "./utilities/firebase";
import "./ListingsPage.css"; // Include your custom CSS for this page
import PlantDetails from "./PlantDetails";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";

const ListingsPage = ({ user }) => {
  const [plants, setPlants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const dbRef = ref(database);
      get(child(dbRef, `posts`))
          .then((snapshot) => {
              if (snapshot.exists()) {
                  const data = snapshot.val();
                  const plantsArray = Object.entries(data).map(([id, plant]) => ({
                      id,
                      ...plant
                  }));
                  setPlants(plantsArray);
              } else {
                  console.log("No data available");
              }
          })
          .catch((error) => {
              console.error("Error fetching data:", error);
          });

      const userRef = ref(database, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
              const userData = snapshot.val();
              setUserLocation(userData.address);
          } else {
              console.log("No user data available");
          }
      }).catch((error) => {
          console.error("Error fetching user address:", error);
      });
  }, [user]);

  const handleMoreDetails = (plant) => {
      setSelectedPlant(plant);
      setShowPopup(true);
  };

  const handleMarkerClick = (plantOrPlants) => {
      // should navigate to list of plants in this location
      // currently not supported
      if (Array.isArray(plantOrPlants)) {
          navigate('/listings', { state: { plants: plantOrPlants } });
      } else {
          handleMoreDetails(plantOrPlants);
      }
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
              <MapComponent userLocation={userLocation} plants={plants} onMarkerClick={handleMarkerClick} />
          </div>

          {showPopup && (
              <PlantDetails plant={selectedPlant} onClose={handleClosePopup} />
          )}
      </div>
  );
};

export default ListingsPage;

