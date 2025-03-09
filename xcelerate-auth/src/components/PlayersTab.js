import React, { useEffect, useState } from "react";

const PlayersTab = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch players data from the backend
    fetch("http://localhost:5000/api/players")
      .then((response) => response.json())
      .then((data) => {
        console.log("Players data:", data); // Debugging
        setPlayers(data);
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  return (
    <div className="players-tab">
      <h2>Players</h2>
      {players.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>University</th>
                <th>Role</th>
                <th>Runs</th>
                <th>Wickets</th>
                <th>Points</th>
                <th>Value (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  <td>{player.name}</td>
                  <td>{player.university}</td>
                  <td>{player.role}</td>
                  <td>{player.runs}</td>
                  <td>{player.wickets}</td>
                  <td>{player.points}</td>
                  <td>{player.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No players found.</p>
      )}
    </div>
  );
};

export default PlayersTab;