import React, { useState, useEffect } from "react";

const SelectTeamTab = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [budget, setBudget] = useState(9000000);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch players data from the backend
    fetch("/api/players")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const handleAddPlayer = async (player) => {
    if (selectedPlayers.includes(player)) {
      alert("Player already in the team!");
    } else if (budget >= player.value) {
      try {
        // Add player to the user's team in the backend
        const response = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, playerId: player._id }),
        });

        if (response.ok) {
          setSelectedPlayers([...selectedPlayers, player]);
          setBudget(budget - player.value);
        } else {
          alert("Failed to add player to team");
        }
      } catch (error) {
        console.error("Error adding player to team:", error);
      }
    } else {
      alert("Not enough budget!");
    }
  };

  return (
    <div className="select-team-tab">
      <h2>Select Your Team</h2>
      <p>Remaining Budget: Rs. {budget}</p>
      <ul>
        {players.map((player) => (
          <li key={player._id}>
            {player.name} - {player.university} (Rs. {player.value})
            <button onClick={() => handleAddPlayer(player)}>Add to Team</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectTeamTab;