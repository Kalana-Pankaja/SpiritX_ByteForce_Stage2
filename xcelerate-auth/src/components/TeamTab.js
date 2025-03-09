import React from "react";

const TeamTab = ({ selectedPlayers, setSelectedPlayers, setBudget }) => {
  const totalPoints = selectedPlayers.reduce((sum, player) => sum + player.points, 0);

  const handleRemovePlayer = async (player) => {
    try {
      // Remove player from the user's team in the backend
      const response = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: localStorage.getItem("userId"), playerId: player._id }),
      });

      if (response.ok) {
        setSelectedPlayers(selectedPlayers.filter((p) => p._id !== player._id));
        setBudget((prevBudget) => prevBudget + player.value);
      } else {
        alert("Failed to remove player from team");
      }
    } catch (error) {
      console.error("Error removing player from team:", error);
    }
  };

  return (
    <div className="team-tab">
      <h2>Your Team</h2>
      <p>Total Points: {totalPoints}</p>
      <ul>
        {selectedPlayers.map((player) => (
          <li key={player._id}>
            {player.name} - {player.university} (Rs. {player.value})
            <button onClick={() => handleRemovePlayer(player)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamTab;