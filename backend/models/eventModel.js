import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Upcoming", "Ongoing", "Completed"],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
