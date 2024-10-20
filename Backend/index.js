const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); 
const eventRoutes = require("./routes/eventRoutes"); 

const app = express();


app.use(bodyParser.json());

app.use("/api/events", eventRoutes);

async function connectDB() {
  const uri = process.env.MONGODB_URI; 
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database: " + error);
  }
}

const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
