import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [data, setData] = useState({ email: '', otp: '', newPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, data);
      alert("Password updated successfully!");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP or error!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md space-y-4">
        <h2 className="text-2xl font-black text-[#f05a28]">Reset Password</h2>
        <input type="email" placeholder="Email" onChange={(e) => setData({...data, email: e.target.value})} className="w-full border p-3 rounded-xl" required />
        <input type="text" placeholder="Enter OTP" onChange={(e) => setData({...data, otp: e.target.value})} className="w-full border p-3 rounded-xl" required />
        <input type="password" placeholder="New Password" onChange={(e) => setData({...data, newPassword: e.target.value})} className="w-full border p-3 rounded-xl" required />
        <button className="w-full bg-[#f05a28] text-white py-3 rounded-xl font-bold">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;