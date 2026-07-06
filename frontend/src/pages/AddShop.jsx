import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import axios from 'axios';

const AddShop = () => {
  const [formData, setFormData] = useState({
    name: '', city: 'kathmandu', state: 'bagmati', address: ''
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); 
    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('address', formData.address);
    data.append('image', image);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/shops/add`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Shop Added Successfully!");
    } catch (error) {
      console.error("Shop Add Error:", error.response?.data || error.message);
      alert("Error adding shop! Please check your login status.");
    }
  };  //HandleSubmit function ends here

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9] p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-full max-w-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-50 p-4 rounded-full text-[#f05a28]">
            <Utensils size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-800 text-center mb-8">Add Shop</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Name</label>
            <input type="text" placeholder="Enter Shop Name" required 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#f05a28]" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Shop Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required
              className="w-full border border-gray-200 rounded-xl p-2.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:font-semibold" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-600 mb-1.5">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-600 mb-1.5">State</label>
              <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Address</label>
            <textarea placeholder="Enter Address" required rows="2"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none" />
          </div>

          <button type="submit" className="w-full bg-[#f05a28] hover:bg-[#e04a1e] text-white font-bold py-3.5 rounded-xl transition-all">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShop;