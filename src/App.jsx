import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListingsPage from './ListingsPage';
import FormComponent from './FormComponent';
import ProfileComponent from './Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the HomePage route */}
        <Route path="/" element={<Home />} />
        {/* Define the ListingsPage route */}
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/posting" element={<FormComponent/>}/>
        <Route path="/profile" element={<ProfileComponent/>}/>
      </Routes>
    </Router>
  );
};

export default App;


