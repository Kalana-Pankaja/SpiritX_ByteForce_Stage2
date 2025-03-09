const mongoose = require("mongoose");

// Define the Player schema
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  role: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  points: { type: Number, default: 0 }, // Calculated points
  value: { type: Number, default: 0 }, // Calculated value
});

// Create and export the Player model
module.exports = mongoose.model("Player", playerSchema);