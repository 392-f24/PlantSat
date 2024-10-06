import React, { useState } from 'react';
import './styles/FormComponent.css';
import { database } from './utilities/firebase';
import { ref, set } from "firebase/database";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    duration: '',
    description: '',
    careDetails: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Should be either hash value or changed to userId later
    const plantId = 3;
    const dbRef = ref(database, `plants/${plantId}`);
    set(dbRef, {
      care: "Take out daily for sun",
      duration: "3 weeks",
      favorite: false,
      imageUrl: "/plant3.webp",
      name: "Palm tree",
      price: 30,
      reviews: 200,
      rating: 4
    })
    // successful posting redirects user to postings
    .then(() => {
      window.location.href = "/listings";
    })
    // catch error
    .catch((error) => {
      console.error("Error storing data: ", error)
    })
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Fill out this information to get started</h2>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration</label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="careDetails">Care Details</label>
        <input
          type="text"
          id="careDetails"
          name="careDetails"
          value={formData.careDetails}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUpload">Upload Image</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {formData.image && <p className="file-info">Selected file: {formData.image.name}</p>}
      </div>

      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default FormComponent;
