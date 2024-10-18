import { useState } from 'react';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListingsPage from './ListingsPage';
import FormComponent from './FormComponent';
import ProfileComponent from './Profile';

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Routes>
        {/* Define the HomePage route */}
        <Route path="/" element={<Home user={user} setUser={setUser}/>} />
        {/* Define the ListingsPage route */}
        <Route path="/listings" element={<ListingsPage user={user}/>} />
        <Route path="/posting" element={<FormComponent user={user}/>}/>
        <Route path="/profile" element={<ProfileComponent user={user}/>}/>
      </Routes>
    </Router>
  );
};

export default App;


