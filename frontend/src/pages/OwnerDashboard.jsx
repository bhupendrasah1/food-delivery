import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

const OwnerDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get('/api/foods');
      setMenuItems(res.data.foods || res.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setMenuItems([]);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('यो आइटम मेटाउने पक्का हुनुहुन्छ?')) return;

    try {
      await API.delete(`/api/foods/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      alert(error.response?.data?.message || 'मेटाउन समस्या भयो।');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setSaving(true);
      const response = await API.put(`/api/foods/${editingItem.id}`, {
        name: editingItem.name,
        price: editingItem.price,
        description: editingItem.description,
      });

      const updatedFood = response.data.food || response.data;
      setMenuItems((prev) => prev.map((item) => (item.id === updatedFood.id ? updatedFood : item)));
      setEditingItem(null);
    } catch (error) {
      alert(error.response?.data?.message || 'अपडेट गर्न समस्या भयो।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6 text-gray-800">Owner Dashboard</h1>
      
      <div className="flex gap-4 mb-8">
        <Link to="/add-shop" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition">
          Add New Shop
        </Link>
        <Link to="/add-food" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition">
          Add New Food Item
        </Link>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4">
            <div className="flex items-center gap-4 flex-1">
              <img
                src={item.image_url || "/placeholder-food.jpg"} 
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                onError={(e) => e.target.src = '/placeholder-food.jpg'} // इमेज लोड नभए placeholder देखाउँछ
              />
              
              {editingItem?.id === item.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border-b-2 border-orange-500 focus:outline-none px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border-b-2 border-orange-500 focus:outline-none px-2 py-1"
                  />
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm truncate max-w-sm">{item.description}</p>
                  <p className="font-black text-[#f05a28] mt-1">₹ {item.price}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 text-gray-400">
              {editingItem?.id === item.id ? (
                <>
                  <button onClick={handleSaveEdit} disabled={saving} className="text-green-600 p-2"><Check size={20} /></button>
                  <button onClick={() => setEditingItem(null)} className="text-gray-600 p-2"><X size={20} /></button>
                </>
              ) : (
                <button onClick={() => setEditingItem({ ...item })} className="hover:text-blue-600 p-2"><Pencil size={18} /></button>
              )}
              <button onClick={() => handleDelete(item.id)} className="hover:text-red-600 p-2"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;