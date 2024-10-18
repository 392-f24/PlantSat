import React, { useEffect, useState } from "react";
import { ref, child, get, set } from "firebase/database";
import { database } from "./utilities/firebase";
import "./ListingsPage.css";
import PlantDetails from "./PlantDetails";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";

const ListingsPage = ({ user }) => {
  const [plants, setPlants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("default"); // New state for sorting
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

  const sortPlants = (plantsArray) => {
    switch (sortCriteria) {
      case "price":
        return [...plantsArray].sort((a, b) => b.price - a.price);
      case "rating":
        return [...plantsArray].sort((a, b) => b.rating - a.rating); // Descending rating
      case "duration":
        return [...plantsArray].sort((a, b) => a.duration.localeCompare(b.duration));
      default:
        return plantsArray; // Default sorting (no sort)
    }
  };

  const handleMoreDetails = (plant) => {
    setSelectedPlant(plant);
    setShowPopup(true);
  };

  const handleMarkerClick = (plantOrPlants) => {
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

  const handleBooking = async (plant) => {
    const dbRef = ref(database, `posts/${plant}/requests`);
    try {
      const snapshot = await get(dbRef);
      const currentRequests = snapshot.exists() ? snapshot.val() : [];
      const updatedRequests = Array.isArray(currentRequests) ? currentRequests : [];
      if (!updatedRequests.includes(user.uid)) {
        updatedRequests.push(user.uid);
      }
      await set(dbRef, updatedRequests);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
    handleClosePopup();
  };

  return (
    <div className="listings-container">
      <div className="listings-column">
        <h1 className="page-title">
          PLANTSAT
          <div>
            <button className="my-post-button" onClick={() => navigate('/posting')}>
              Post
            </button>
            <button className="my-post-button" onClick={() => navigate('/my-postings')}>
              My Postings
            </button>
          </div>
        </h1>
        <p>{plants.length} plants needing homes</p>

        {/* Dropdown for sorting */}
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="duration">Duration</option>
        </select>

        {sortPlants(plants).map((plant) => (
          <div key={plant.name} className="plant-card">
            <img src={plant.imageUrl} alt={plant.name} className="listings-plant-image" />
            <div className="plant-info">
              <h2>{plant.name}</h2>
              <p>{plant.location && <em>{plant.location}</em>}</p>
              <p>{plant.duration}</p>
              <p>{plant.care}</p>
            </div>
            <div className="plant-action">
              <p className="price">${plant.price} /week</p>
              <button className="book-btn" onClick={() => handleMoreDetails(plant)}>
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
        <PlantDetails plant={selectedPlant} onClose={handleClosePopup} handleBooking={handleBooking} />
      )}
    </div>
  );
};

export default ListingsPage;

