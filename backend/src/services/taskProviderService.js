Create task provider service:
const axios = require('axios');
const Task = require('../models/Task');

const providers = {
  mturk: {
    fetchTasks: async () => {
      // Implement Amazon MTurk API integration
      const response = await axios.get('https://mturk-requester-sandbox.us-east-1.amazonaws.com/hits');
      return response.data.map(hit => ({
        title: hit.Title,
        description: hit.Description,
        reward: parseFloat(hit.Reward),
        provider: 'mturk',
      }));
    }
  },
  appen: {
    fetchTasks: async () => {
      // Implement Appen API integration
      const response = await axios.get('https://api.appen.com/v1/jobs');
      return response.data.map(job => ({
        title: job.title,
        description: job.description,
        reward: job.reward,
        provider: 'appen',
      }));
    }
  },
  // Add more providers as needed
};

exports.fetchAndStoreTasks = async () => {
  try {
    for (const [providerName, provider] of Object.entries(providers)) {
      const tasks = await provider.fetchTasks();
      for (const task of tasks) {
        await Task.findOneAndUpdate(
          { title: task.title, provider: providerName },
          task,
          { upsert: true, new: true }
        );
      }
    }
    console.log('Tasks updated successfully');
  } catch (error) {
    console.error('Error updating tasks:', error);
  }
};
