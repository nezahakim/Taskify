import React, { useState, useEffect } from "react";
import api from "../services/api";

interface User {
  username: string;
  email: string;
  balance: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put("/users/me", {
        username: newUsername,
        email: newEmail,
      });
      setUser(response.data);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage("Error updating profile");
    }
  };

  if (!user) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <p className="mb-2">Current Balance: ${user.balance.toFixed(2)}</p>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
