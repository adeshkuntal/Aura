import React from "react";
import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";


const Layout = ({ user, setUser }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ProfileHeader user={user} setUser={setUser} />

      {/* Main Content */}
      <div className="flex-1 ml-64 relative flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
