require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeDB } = require("./db/db");

const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/trips", tripRoutes); 

initializeDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("server is running...");
  });
});
