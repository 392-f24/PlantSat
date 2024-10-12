import React, { useState } from 'react';
import './styles/FormComponent.css';
import { database } from './utilities/firebase';
import { ref, set } from "firebase/database";

const ProfileComponent = ({uid}) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    setProfileData({
      ...profileData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Should be either hash value or changed to userId later
    const plantId = Math.floor(Math.random() * 100) + 3;
    const dbRef = ref(database, `plants/${parseInt(plantId)}`);
    set(dbRef, {
      care: profileData.careDetails,
      duration: profileData.duration,
      favorite: false,
      imageUrl: "/plant1.webp",
      name: profileData.name,
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
      <h2 className="form-title">Create Your Profile</h2>

      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={profileData.firstName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={profileData.lastName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={profileData.address}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUpload">Profile Picture</label>
        <input
          type="file"
          id="pic"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {profileData.pic && <p className="file-info">Selected file: {profileData.pic.name}</p>}
      </div>

      <button type="submit" className="submit-button" onClick={() => window.location.href = "/listings"}>Complete</button>
    </form>
  );
};

export default ProfileComponent;
