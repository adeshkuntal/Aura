import React from "react";
import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import Footer from "../components/Footer";

const Layout = ({ user, setUser }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, shown with drawer */}
      <div className="hidden md:block">
        <ProfileHeader user={user} setUser={setUser} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/lily.jpeg"
              alt="Aura Logo"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Aura
            </h1>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {user?.username || "User"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative flex flex-col mt-16 md:mt-0">
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Mobile Footer */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;