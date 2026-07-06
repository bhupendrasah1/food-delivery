import React, { useState } from 'react';
import axios from 'axios';

const AddFood = () => {
  const [food, setFood] = useState({ name: '', price: '', description: '' });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); 

    const formData = new FormData();
    formData.append('name', food.name);
    formData.append('price', food.price);
    formData.append('description', food.description); 
    formData.append('shopId', '1'); 
    formData.append('image', image);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/foods/add`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Food Item Added!");
    } catch (error) {
  console.log("Full Error Object:", error);
  if (error.response && error.response.data) {
    console.log("Server Error Message:", error.response.data);
    alert("Error: " + JSON.stringify(error.response.data));
  } else {
    alert("Failed to add food: " + error.message);
  }
}
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 max-w-lg mx-auto bg-white rounded-3xl shadow-lg">
      <h2 className="text-2xl font-black mb-6 text-gray-800">Add New Food Item</h2>
      <input type="text" placeholder="Food Name" onChange={(e) => setFood({...food, name: e.target.value})} className="w-full border p-3 rounded-xl mb-4" />
      <input type="number" placeholder="Price" onChange={(e) => setFood({...food, price: e.target.value})} className="w-full border p-3 rounded-xl mb-4" />
      <input type="text" placeholder="Description" onChange={(e) => setFood({...food, description: e.target.value})} className="w-full border p-3 rounded-xl mb-4" />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full mb-4" />
      <button type="submit" className="w-full bg-[#f05a28] text-white py-3 rounded-xl font-bold">Save Food</button>
    </form>
  );
};
export default AddFood;