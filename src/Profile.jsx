import React, { useEffect, useState } from 'react';
import './styles/FormComponent.css';
import { database } from './utilities/firebase';
import { ref, set, get } from "firebase/database";
import { Autocomplete } from '@react-google-maps/api';

const ProfileComponent = ({ user }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    pic: null,
  });

  const [newUser, setNewUser] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, `users/${user.uid}`);
    get(dbRef).then((snapshot) => {
      if (!snapshot.exists()) {
        setNewUser(true);
        const displayName = user.displayName || '';
        const names = displayName.split(' ');
        setProfileData({
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          address: '',
          pic: null
        });
      } else {
        const userData = snapshot.val();
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          address: userData.address || '',
          pic: userData.pic || null,
        });
      }
    }).catch((error) => {
      console.error("Error fetching user", error);
    });
  }, [user]);

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
      pic: e.target.files[0],
    });
  };

  const handleAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handleAddressChange = () => {
    const place = autocomplete.getPlace();
    setProfileData({
      ...profileData,
      address: place.formatted_address,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUser && (!profileData.address || !profileData.firstName || !profileData.lastName)) {
      alert("Please fill in all fields");
      return;
    }

    const dbRef = ref(database, `users/${user.uid}`);
    const updatedData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      address: profileData.address,
      pic: profileData.pic,
      email: user.email
    };

    set(dbRef, updatedData)
      .then(() => {
        console.log("Profile updated successfully");
        window.location.href = "/listings";
      })
      .catch((error) => {
        console.error("Error storing data: ", error);
      });
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
        <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handleAddressChange}>
          <input
            type="text"
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            required
          />
        </Autocomplete>
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

      <button type="submit" className="submit-button">Complete</button>
    </form>
  );
};

export default ProfileComponent;
