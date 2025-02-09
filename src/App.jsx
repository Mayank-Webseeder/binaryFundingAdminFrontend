import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import AdminPanel from "./components/AllUsers"
import AdminLogin from './components/AdminLogin';
import OtpVerification from "./components/OtpVerification"
import SettingsPage from './components/SettingsPage';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="left-0 top-0 h-full lg:w-64 bg-gray-900 z-50">
        <SideBar />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

function App() {

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/allUsers" element={<AdminPanel />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notification" element={<Notification />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

