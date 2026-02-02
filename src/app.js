const express = require("express");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
require("./config/redis");
const path = require("path");

const app = express();
connectDB();
const cors = require("cors");
app.use(cors());
app.use(express.json()); 

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api", urlRoutes);     
app.use("/", urlRoutes); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
