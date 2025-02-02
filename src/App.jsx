import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import AdminPanel from "./components/AdminPanel"
import AdminLogin from './components/AdminLogin';
import OtpVerification from "./components/OtpVerification"
import SettingsPage from './components/SettingsPage';
import SideBar from './components/SideBar';

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
    // <div className="min-h-screen bg-black">
    //   <Routes>
    //       <Route path="/" element={<AdminPanel/>} />
    //       <Route path='/login' element = {<AdminLogin/>} />
    //       <Route path='/otp' element = {<OtpVerification/>} />
    //       <Route path='/settings' element = {<SettingsPage/>} />
    //       <Route path='/sidebar' element = {<SideBar/>} />
    //   </Routes>
    // </div>

    <Routes>
      {/* Routes without Sidebar */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/otp" element={<OtpVerification />} />

      {/* Routes with Sidebar */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<AdminPanel />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

