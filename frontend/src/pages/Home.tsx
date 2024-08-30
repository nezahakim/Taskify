import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to TaskMaster</h1>
      <p className="text-xl mb-8">Complete tasks, earn money!</p>
      <div className="space-x-4">
        <Link to="/register" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside text-left max-w-md mx-auto">
          <li className="mb-2">Sign up for an account</li>
          <li className="mb-2">Browse available tasks</li>
          <li className="mb-2">Complete tasks to earn money</li>
          <li className="mb-2">Cash out your earnings</li>
        </ol>
      </section>
    </div>
  );
};

export default Home;
