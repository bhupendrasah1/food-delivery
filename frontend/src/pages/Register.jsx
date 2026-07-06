import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', role: 'user'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      alert("Account created successfully! Please Sign In.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9] p-4 font-sans">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 w-full max-w-md">
        
        <h1 className="text-[32px] font-black text-[#f05a28] mb-1">Vingo</h1>
        <p className="text-gray-500 text-sm mb-8">Create your account to get started with delicious food deliveries</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" name="name" onChange={handleChange} placeholder="Enter your Full Name" required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#f05a28] transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter your Email" required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#f05a28] transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile</label>
            <input type="text" name="mobile" onChange={handleChange} placeholder="Enter your Mobile Number" required
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#f05a28] transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} placeholder="Enter your password" required
                className="w-full border border-gray-200 rounded-xl p-3 pr-10 text-sm outline-none focus:border-[#f05a28] transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
            <div className="flex justify-between gap-2">
              {['user', 'owner', 'deliveryBoy'].map((r) => (
                <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-colors capitalize ${
                    formData.role === r ? 'bg-[#f05a28] text-white border-[#f05a28]' : 'bg-white text-[#f05a28] border-gray-200 hover:border-[#f05a28]'
                  }`}>
                  {r === 'deliveryBoy' ? 'Delivery Boy' : r}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#f05a28] hover:bg-[#e04a1e] text-white font-bold py-3.5 rounded-xl transition-colors mt-2">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <button type="button" onClick={handleGoogleSignup} className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            Sign up with Google
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-[#f05a28] font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;