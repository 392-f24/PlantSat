import { useState } from 'react';
import logo from './logo.svg';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListingsPage from './ListingsPage';
import FormComponent from './FormComponent';
import ProfileComponent from './Profile';
import LoginPage from './LoginPage';

const App = () => {
  const [uid, setUid] = useState(null);
  return (
    <Router>
      <Routes>
        {/* Define the HomePage route */}
        <Route path="/" element={<Home uid={uid} setUid={setUid}/>} />
        {/* Define the ListingsPage route */}
        <Route path="/listings" element={<ListingsPage uid={uid}/>} />
        <Route path="/posting" element={<FormComponent/>}/>
        <Route path="/profile" element={<ProfileComponent uid={uid}/>}/>
        <Route path="/login" element={<LoginPage setUid={setUid}/>}/>
      </Routes>
    </Router>
  );
};

export default App;


