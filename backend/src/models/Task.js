const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  provider: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "in_progress", "completed"],
    default: "available",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
