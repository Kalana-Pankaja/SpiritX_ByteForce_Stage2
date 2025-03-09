const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Player = require("./models/Player");

// MongoDB Connection String
const MONGO_URI = "mongodb+srv://KusalP:fDFY3j1ANRcY3qVv@spiritx.0gtwk.mongodb.net/?retryWrites=true&w=majority&appName=spiritx";

// Helper Functions for Player Points and Value
const calculatePoints = (runs, wickets) => {
  return runs * 1 + wickets * 10; // Example logic
};

const calculateValue = (points) => {
  return Math.round(points / 50000) * 50000; // Round to nearest 50,000
};

// Connect to MongoDB and process CSV file
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    // Read CSV file and add players to the database
    const players = [];
    fs.createReadStream("sample_data.csv")
      .pipe(csv())
      .on("data", (row) => {
        const { Name, University, Category, "Total Runs": runs, Wickets } = row;

        // Calculate points and value
        const points = calculatePoints(parseInt(runs), parseInt(Wickets));
        const value = calculateValue(points);

        // Create new player
        const newPlayer = new Player({
          name: Name,
          university: University,
          role: Category,
          runs: parseInt(runs),
          wickets: parseInt(Wickets),
          points,
          value,
        });

        players.push(newPlayer);
      })
      .on("end", async () => {
        // Save all players to the database
        await Player.insertMany(players);
        console.log("✅ All players added to the database");
        mongoose.connection.close();
      });
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Run the main function
main();