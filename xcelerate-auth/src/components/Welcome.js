import React from "react";
import { useNavigate, Link, Route, Routes } from "react-router-dom";
import "./styles.css";
import PlayersTab from "./PlayersTab";
import SelectTeamTab from "./SelectTeamTab";
import TeamTab from "./TeamTab";
import BudgetTab from "./BudgetTab";
import LeaderboardTab from "./LeaderboardTab";
import SpiriterChatbot from "./SpiriterChatbot";

const Welcome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="welcome-box">
        <h2>Hello, {username}!</h2>
        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link to="/players">Players</Link> | 
        <Link to="/select-team">Select Your Team</Link> | 
        <Link to="/team">Team</Link> | 
        <Link to="/budget">Budget</Link> | 
        <Link to="/leaderboard">Leaderboard</Link> | 
        <Link to="/spiriter">Spiriter Chatbot</Link>
      </nav>

      {/* Routes for Each Tab */}
      <Routes>
        <Route path="/players" element={<PlayersTab />} />
        <Route path="/select-team" element={<SelectTeamTab />} />
        <Route path="/team" element={<TeamTab />} />
        <Route path="/budget" element={<BudgetTab />} />
        <Route path="/leaderboard" element={<LeaderboardTab />} />
        <Route path="/spiriter" element={<SpiriterChatbot />} />
      </Routes>
    </div>
  );
};

export default Welcome;