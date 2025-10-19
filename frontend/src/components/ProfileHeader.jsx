import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LogOut, User, PlusCircle, Search } from "lucide-react";

const ProfileHeader = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Upload Post", path: "/upload-post", icon: <PlusCircle size={20} /> },
    { name: "Search", path: "/search", icon: <Search size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl flex flex-col justify-between py-6 px-4 z-50 border-r border-gray-200">
      {/* Logo & Branding */}
      <div>
        <div
          className="flex items-center gap-3 mb-10 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <img
              src="/images/lily.jpeg"
              alt="Aura Logo"
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Aura
            </h1>
            <p className="text-xs text-gray-600 -mt-1">Share Your Social Aura</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* User & Logout */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email || "aura@app.com"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ProfileHeader;
