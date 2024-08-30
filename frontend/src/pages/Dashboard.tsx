import React, { useState, useEffect } from "react";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  reward: number;
}

interface User {
  username: string;
  balance: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get("/users/me");
        setUser(userResponse.data);
        const tasksResponse = await api.get("/tasks/active");
        setActiveTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const completeTask = async (taskId: string) => {
    try {
      await api.post(`/tasks/${taskId}/complete`);
      // Refresh active tasks and user data
      const tasksResponse = await api.get("/tasks/active");
      setActiveTasks(tasksResponse.data);
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  if (!user) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h2>
      <p className="text-xl mb-8">
        Current Balance: ${user.balance.toFixed(2)}
      </p>
      <h3 className="text-2xl font-semibold mb-4">Active Tasks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTasks.map((task) => (
          <div key={task._id} className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-xl font-semibold mb-2">{task.title}</h4>
            <p className="text-lg mb-4">Reward: ${task.reward}</p>
            <button
              onClick={() => completeTask(task._id)}
              className="btn btn-primary w-full"
            >
              Complete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
