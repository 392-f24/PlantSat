import React, { useState } from 'react';
import './styles/FormComponent.css';
import { database } from './utilities/firebase';
import { ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const FormComponent = ({ user }) => {
  const navigate = useNavigate();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    duration: '',
    price: '',
    careDetails: '',
    image: null,
  });

  const [error, setError] = useState('');

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

  const uploadImageAndGetUrl = async (image) => {
    const imageRef = storageRef(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image); // upload the image
    return await getDownloadURL(imageRef); // get the download URL
  };

  const isPhoneNumberValid = (phone) => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phonePattern.test(phone);
  };
  

  const isDurationValid = (duration) => {
    const durationInt = parseInt(duration, 10);
    return !isNaN(durationInt) && durationInt > 0;
  };

  const isPriceValid = (price) => {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    return pricePattern.test(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPhoneNumberValid(formData.phoneNumber)) {
      setError('Invalid phone number format');
      return;
    }

    if (!isDurationValid(formData.duration)) {
      setError('Duration must be a positive integer');
      return;
    }

    if (!isPriceValid(formData.price)) {
      setError('Invalid price. Price should be a number with up to two decimal places.');
      return;
    }

    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadImageAndGetUrl(formData.image); // Upload and get the URL
      }

      const dbRef = ref(database, 'posts');
      await push(dbRef, {
        owner: user.uid,
        phoneNumber: formData.phoneNumber,
        care: formData.careDetails,
        duration: formData.duration,
        favorite: false,
        imageUrl: imageUrl || "/plant1.webp",
        name: formData.name,
        price: formData.price,
      });

      navigate('/listings');
    } catch (error) {
      console.error("Error storing data: ", error);
      setError("An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Fill out this information to get started</h2>

      {error && <p className="error-message">{error}</p>}

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
          placeholder="xxx-xxx-xxxx"
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
          placeholder="Number of weeks"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          placeholder="0.00"
          value={formData.price}
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
          placeholder="Any details that would be useful for your plant caretaker to know, like how often to water."
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
