import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Available Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-4">
              {task.description.substring(0, 100)}...
            </p>
            <p className="text-lg font-bold mb-4">Reward: ${task.reward}</p>
            <Link to={`/tasks/${task._id}`} className="btn btn-primary">
              View Task
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
