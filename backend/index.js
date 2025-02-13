import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoute from "./routes/productRoute.js";
import eventsRoute from "./routes/eventsRoute.js"

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/NotApologetic";

// Middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to NotApologetic API");
});

app.use("/products", productRoute);
app.use("/events", eventsRoute);

// Database Connection (Removing Deprecated Options)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("MongoDB connection error:", error.message));
