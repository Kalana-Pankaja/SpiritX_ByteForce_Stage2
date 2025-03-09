import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import PlayersTab from "./components/PlayersTab"; // Import the PlayersTab component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/players" element={<PlayersTab />} /> {/* Add PlayersTab route */}
      </Routes>
    </Router>
  );
}

export default App;