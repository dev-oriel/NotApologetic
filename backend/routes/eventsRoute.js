import express from "express";
import multer from "multer";
import Event from "../models/eventModel.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new event
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      location,
      description,
      price,
      category,
      status,
    } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newEvent = new Event({
      title,
      date,
      time,
      location,
      image: imagePath,
      description,
      price,
      category,
      status,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
});

// Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
});

// Update an event
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      location,
      description,
      price,
      category,
      status,
    } = req.body;
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        time,
        location,
        image: imagePath,
        description,
        price,
        category,
        status,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
});

export default router;
