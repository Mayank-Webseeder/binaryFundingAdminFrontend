import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import AdminLogin from './components/AdminLogin';
import OtpVerification from "./components/OtpVerification"
import SettingsPage from './components/SettingsPage';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import ActiveUsers from './components/ActiveUsers';
import InactiveUsers from './components/InActiveUsers';
import Rebates from './components/Rebates';
import WithdrawalRequests from './components/WithdrawalRequests';
import PrivateRoute from "./components/PrivateRoute";

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
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/activeUsers" element={<ActiveUsers />} />
                <Route path="/inactive-users" element={<InactiveUsers />} />
                <Route path="/rebates" element={<Rebates />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/withdrawal-requests" element={<WithdrawalRequests />} />
              </Route>
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

