import React from "react";
import "./styles/PlantDetails.css";

const PlantDetails = ({ plant, onClose }) => {
  if (!plant) return null;

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
          <p>Name: {plant.ownerName}</p>
          <p>City: {plant.city}</p>
          <p>Email: {plant.email}</p>
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
