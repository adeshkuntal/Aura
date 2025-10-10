import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import UploadPost from "./pages/UploadPost";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/me", {withCredentials: true});
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/edit-profile" element={<EditProfile user={user} setUser={setUser} />} />
            <Route path="/upload-post" element={<UploadPost user={user} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}