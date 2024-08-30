require("dotenv").config();
const cron = require("node-cron");
const app = require("./src/app");
const connectDB = require("./src/config/database");
const { fetchAndStoreTasks } = require("./src/services/taskProviderService");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Refresh tasks every hour
  cron.schedule("0 * * * *", () => {
    console.log("Refreshing tasks...");
    fetchAndStoreTasks();
  });
});
