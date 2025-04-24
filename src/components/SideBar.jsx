import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Settings, Bell, LogOut, Users } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get current route

  const handleLogout = () => {
    const logout = window.confirm("Are you sure you want to LogOut?");
    if (logout) {
      localStorage.removeItem("adminToken");
      navigate("/login");
    }
  };

  // Helper function to determine if a route is active
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static w-64 md:w-64 h-screen bg-gray-900 shadow-lg z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 flex flex-col
        `}
      >
        <div className="p-10">
          <img src="/logos/full.png" alt="Admin Panel Logo" className="h-10 w-auto" />
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Dashboard
            </div>
          </Link>
          <Link
            to="/users"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/users") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Users
            </div>
          </Link>
          <Link
            to="/requested"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/requested") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Requested
            </div>
          </Link>
          
          {/* <Link
            to="/activeUsers"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/activeUsers") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Active Users
            </div>
          </Link>
          <Link
            to="/inactive-users"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/inactive-users") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Inactive Users
            </div>
          </Link> */}
          <Link
            to="/rebates"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/rebates") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Rebates
            </div>
          </Link>
          {/* <Link
            to="/withdrawal-requests"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/withdrawal-requests") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />Withdrawal Requests
            </div>
          </Link> */}
          <Link
            to="/affiliate-withdrawal"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/affiliate-withdrawal") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />Affiliate Withdrawal
            </div>
          </Link>
          <Link
            to="/customer-withdrawal"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/customer-withdrawal") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />Customer Withdrawal
            </div>
          </Link>
          <Link
            to="/support-query"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/customer-withdrawal") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />Support Query
            </div>
          </Link>
          <Link
            to="/settings"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/settings") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={20} /> Settings
            </div>
          </Link>
        </nav>

        <div className="p-4 space-y-2 absolute bottom-1 w-full">
          <Link
            to="/notification"
            className={`block w-full text-left p-2 rounded text-white ${
              isActiveRoute("/notification") ? "bg-[#0f6dd3]" : "bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Bell size={20} /> Notifications
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left p-2 rounded bg-[#0f6dd3]/20 hover:bg-[#0f6dd3] text-white"
          >
            <div className="flex items-center gap-2 justify-center">
              <LogOut size={20} /> Logout
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;