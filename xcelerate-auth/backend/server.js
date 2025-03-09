console.log("Starting server...");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection String
const MONGO_URI = "mongodb+srv://KusalP:fDFY3j1ANRcY3qVv@spiritx.0gtwk.mongodb.net/?retryWrites=true&w=majority&appName=spiritx";


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, minlength: 8 },
    email: String,
    password: String,
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // User's fantasy team
    points: { type: Number, default: 0 }, // Total points for the user's team
});

const User = mongoose.model("User", userSchema);

// Player Schema
const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    university: { type: String, required: true },
    role: { type: String, required: true },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    points: { type: Number, default: 0 }, // Calculated points
    value: { type: Number, default: 0 }, // Calculated value
});

const Player = require("./models/Player");

// Example route to fetch all players
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Helper Functions
const calculatePoints = (runs, wickets) => {
    return runs * 1 + wickets * 10; // Example logic
};

const calculateValue = (points) => {
    return Math.round(points / 50000) * 50000; // Round to nearest 50,000
};

// 🔹 Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup request received:", req.body); // Debugging

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        // Validate username length
        if (username.length < 8) {
            return res.status(400).json({ message: "Username must be at least 8 characters long" });
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character"
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Login Route (Now uses Username instead of Email)
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Add Player Route (Admin Only)
app.post("/players", async (req, res) => {
    try {
        const { name, university, role, runs, wickets } = req.body;

        // Calculate points and value
        const points = calculatePoints(runs, wickets);
        const value = calculateValue(points);

        const newPlayer = new Player({ name, university, role, runs, wickets, points, value });
        await newPlayer.save();

        res.json({ message: "Player added successfully!", player: newPlayer });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Fetch All Players Route
app.get("/players", async (req, res) => {
    try {
        const players = await Player.find({});
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Add Player to User's Team
app.post("/team", async (req, res) => {
    try {
        const { userId, playerId } = req.body;

        // Check if player is already in the team
        const user = await User.findById(userId);
        if (user.team.includes(playerId)) {
            return res.status(400).json({ message: "Player already in the team" });
        }

        // Add player to the team
        user.team.push(playerId);
        await user.save();

        res.json({ message: "Player added to team successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Fetch Leaderboard Route
app.get("/leaderboard", async (req, res) => {
    try {
        const users = await User.find({}).sort({ points: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start Server
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));