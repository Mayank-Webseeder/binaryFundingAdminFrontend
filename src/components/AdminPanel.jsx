import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineFeedback, MdOutlineShortcut } from "react-icons/md";
import { IoIosHelpCircleOutline, IoIosLogOut } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const pathName = useSearchParams();

  const handleLogout = () => {
    const logout = window.confirm("Are you sure you want to LogOut?");
    if (logout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-black text-white">
      {/* Sidebar */}

      {/* <aside className="w-full md:w-64 bg-gray-900 shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-[#0f6dd3]">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
        <button className="block w-full text-left p-2 rounded hover:bg-[#0f6dd3]">
            <div className="flex items-center gap-2">
              All Users
            </div>
          </button>
          <button className="block w-full text-left p-2 rounded hover:bg-[#0f6dd3]">
            <div className="flex items-center gap-2">
              <IoSettingsOutline /> Settings
            </div>
          </button>
        </nav>

        <div className="p-4 space-y-2 mt-[400px]">
          <button className="block w-full text-left p-2 rounded bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]">
            <div className="ml-10 flex items-center gap-2">
              <FaBell />  Notifications
            </div>
          </button>
          <button
            className="block w-full text-left p-2 rounded bg-[#0f6dd3]/20 hover:bg-[#0f6dd3]"
            onClick={handleLogout}
          >
            <div className="ml-10 flex items-center gap-2">
              <IoIosLogOut /> Logout
            </div>
          </button>
        </div>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Welcome Section */}
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f6dd3]">Welcome, Admin</h2>
          <p className="text-gray-400">Here's what's been happening in the last 7 days.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[
            { label: "Users", count: "24,000" },
            { label: "Pandits", count: "1,200" },
            { label: "Kathabachaks", count: "2,200" },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-gray-800 shadow rounded-lg text-center">
              <h3 className="text-gray-400">{stat.label}</h3>
              <p className="text-2xl font-bold text-[#0f6dd3]">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* User Growth Chart */}
        <div className="p-4 bg-gray-800 shadow rounded-lg mb-6">
          <h3 className="text-gray-400 mb-2">User Growth</h3>
          <div className="h-48 bg-[#0f6dd3]/20 flex items-center justify-center rounded-lg">
            <p className="text-[#0f6dd3]">Chart goes here</p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 shadow rounded-lg">
              <p className="text-gray-400">Add a new user</p>
              <button className="py-2 px-4 bg-[#0f6dd3] text-white rounded-lg">
                Add User
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;

