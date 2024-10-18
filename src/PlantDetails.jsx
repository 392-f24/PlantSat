import React, { useEffect, useState } from "react";
import { database } from "./utilities/firebase";
import "./styles/PlantDetails.css";
import { ref, get } from "firebase/database";

const PlantDetails = ({ plant, onClose }) => {
  if (!plant) return null;
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(database, `users/${plant.owner}`);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setOwner(snapshot.val());
        }
      })
      .catch((error) => {
        console.error("Error fetching owner data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [plant.owner]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{plant.name}</h2>
        <img src={plant.imageUrl} alt={plant.name} className="popup-plant-image" />
        <div className="popup-details-section">
          <h3>Sitting Details</h3>
          <p>Duration: {plant.duration}</p>
          <p>Compensation: {plant.price}</p>
          <p>Watering: {plant.care}</p>
          <p>Sunlight: {plant.sunlight}</p>
          <p>Special Notes: {plant.specialNotes}</p>
        </div>
        <div className="popup-details-section">
          <h3>Owner Information</h3>
          <p>Name: {owner.firstName} {owner.lastName}</p>
          <p>City: {owner.address}</p>
          <p>Email: {owner.email}</p>
          <p>Phone: {plant.phone}</p>
        </div>
        <div className="popup-actions">
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
