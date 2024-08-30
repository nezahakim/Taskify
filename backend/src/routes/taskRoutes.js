const express = require("express");
const {
  getTasks,
  startTask,
  completeTask,
  refreshTasks,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getTasks);
router.post("/:id/start", auth, startTask);
router.post("/:id/complete", auth, completeTask);
router.post("/refresh", auth, refreshTasks);

module.exports = router;
