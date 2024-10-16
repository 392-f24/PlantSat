import React, { useState } from 'react';
import './styles/FormComponent.css';
import { database } from './utilities/firebase';
import { ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLocation, useNavigate } from 'react-router-dom';

const FormComponent = ({user}) => {
  const navigate = useNavigate();
  const storage = getStorage();
  console.log("in FormComponent", user)
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

  const uploadImageAndGetUrl = async (image) => {
    const imageRef = storageRef(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image); // upload the image
    return await getDownloadURL(imageRef); // get the download URL
  };

  // use push so each post has unique ID
  // each post could also hold user id to
  // show responsibility of post and allow editing and cancelling
  // other choice is to have each user have a post field showing the
  // posts that the user owns.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let imageUrl = '';
        if (formData.image) {
          imageUrl = await uploadImageAndGetUrl(formData.image); // Upload and get the URL
      }

      console.log("imgaeUrl: ", imageUrl);
    

      const dbRef = ref(database, 'posts');
      await push(dbRef, {
        owner: user.uid,
        care: formData.careDetails,
        duration: formData.duration,
        favorite: false,
        imageUrl: imageUrl || "/plant1.webp",
        name: formData.name,
        price: formData.description,
        reviews: 200,
        rating: 4
      })
      
      navigate('/listings');
    }

    
    
    // catch error
    catch(error)  {
      console.error("Error storing data: ", error);
    };
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
        <label htmlFor="description">Price</label>
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
