import React, { useEffect, useState } from 'react';
import { ref, child, get, remove } from 'firebase/database';
import { database } from './utilities/firebase';
import { useNavigate } from 'react-router-dom'; 
import './MyPostings.css';

const MyPostingsComponent = ({ user }) => {
  const [myPlants, setMyPlants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const dbRef = ref(database);
    get(child(dbRef, 'posts'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const userPosts = Object.entries(data)
            .filter(([_, post]) => post.owner === user.uid)
            .map(([id, post]) => ({
              id,
              ...post,
            }));
          setMyPlants(userPosts);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [user]);

  const handleDelete = (plantId) => {
    const plantRef = ref(database, `posts/${plantId}`);
    remove(plantRef)
      .then(() => {
        setMyPlants((prevPlants) =>
          prevPlants.filter((plant) => plant.id !== plantId)
        );
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  return (
    <div className="my-postings-container">
      <h1 className="page-title">
        <button className="post-button" onClick={() => navigate('/listings')}>
          Home
        </button>
        My Postings
        <button className="post-button" onClick={() => navigate('/posting')}>
          New Post
        </button>
      </h1>
      {myPlants.length !== 0 && myPlants.map((plant) => (
        <div key={plant.id} className="plant-card">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="listings-plant-image"
          />
          <div className="plant-info">
            <h2>{plant.name}</h2>
            <p>{plant.duration}</p>
            <p>{plant.care}</p>
            <p>
              <strong>{plant.rating} ⭐</strong> ({plant.reviews} reviews)
            </p>
          </div>
          <div className="plant-action">
            <p className="price">${plant.price} /week</p>
            <button
              className="delete-button"
              onClick={() => handleDelete(plant.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPostingsComponent;
