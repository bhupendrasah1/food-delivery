import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      
      // Redux मा सेभ गर्ने
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));

      // Role अनुसार पेजमा पठाउने
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner-dashboard');
      else if (role === 'deliveryBoy') navigate('/delivery-dashboard');
      else navigate('/');

    } catch (error) {
      alert(error.response?.data?.message || "Invalid Email or Password!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9] p-4 font-sans">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 w-full max-w-md">
        
        <h1 className="text-[32px] font-black text-[#f05a28] mb-1">Vingo</h1>
        <p className="text-gray-500 text-sm mb-8">Sign In to your account to get started with delicious food deliveries</p>

        <form onSubmit={handleSignIn} className="space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#f05a28] transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required
                className="w-full border border-gray-200 rounded-xl p-3 pr-10 text-sm outline-none focus:border-[#f05a28] transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm font-bold text-[#f05a28]">Forgot Password</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#f05a28] hover:bg-[#e04a1e] text-white font-bold py-3.5 rounded-xl transition-colors mt-4">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          
           <button 
         type="button" 
      onClick={handleGoogleLogin} 
      className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
>
  Sign in with Google
</button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Want to create a new account ? <Link to="/register" className="text-[#f05a28] font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;