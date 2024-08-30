const Task = require("../models/Task");
const User = require("../models/User");
const { fetchAndStoreTasks } = require("../services/taskProviderService");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "available" });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.status !== "available") {
      return res.status(400).json({ message: "Task not available" });
    }
    task.status = "in_progress";
    task.assignedTo = req.user._id;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (
      !task ||
      task.status !== "in_progress" ||
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({ message: "Task cannot be completed" });
    }
    task.status = "completed";
    task.completedAt = Date.now();
    await task.save();

    const user = await User.findById(req.user._id);
    user.balance += task.reward;
    user.completedTasks.push(task._id);
    await user.save();

    res.json({ task, newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshTasks = async (req, res) => {
  try {
    await fetchAndStoreTasks();
    res.json({ message: "Tasks refreshed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
