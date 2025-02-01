import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import AdminPanel from "./components/AdminPanel"
import AdminLogin from './components/AdminLogin';
import OtpVerification from "./components/OtpVerification"

function App() {
  
  return (
    <div className="min-h-screen bg-black">
      <Routes>
          <Route path="/" element={<AdminPanel/>} />
          <Route path='/login' element = {<AdminLogin/>} />
          <Route path='/otp' element = {<OtpVerification/>} />
      </Routes>
    </div>
  );
}

export default App;

