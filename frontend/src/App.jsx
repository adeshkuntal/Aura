import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import UploadPost from "./pages/UploadPost";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://aura-zwgl.onrender.com/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.log("User fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Aura...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Layout + Nested Routes */}
        <Route path="/home" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Profile user={user} setUser={setUser} />} />
          <Route path="edit-profile" element={<EditProfile user={user} setUser={setUser} />} />
          <Route path="upload-post" element={<UploadPost user={user} />} />
          <Route path="search" element={<Search user={user} />} />
          <Route path="search/:id" element={<UserProfile user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}
