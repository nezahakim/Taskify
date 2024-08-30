import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
  provider: string;
}

const TaskDetails: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        setError("Error fetching task details");
      }
    };
    fetchTask();
  }, [id]);

  const startTask = async () => {
    try {
      await api.post(`/tasks/${id}/start`);
      history.push("/dashboard");
    } catch (error) {
      setError("Error starting task");
    }
  };

  if (!task) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <p className="text-xl font-bold mb-2">Reward: ${task.reward}</p>
      <p className="text-lg mb-4">Provider: {task.provider}</p>
      <button onClick={startTask} className="btn btn-primary w-full">
        Start Task
      </button>
    </div>
  );
};

export default TaskDetails;
