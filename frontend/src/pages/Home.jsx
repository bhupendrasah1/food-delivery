import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [shops, setShops] = useState([]); // सुरुमा Empty Array
  const [foods, setFoods] = useState([]); // सुरुमा Empty Array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/shops`);
        const foodsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/foods`);
        
        
        setShops(shopsRes.data.shops || []); 
        setFoods(foodsRes.data.foods || []); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  if (loading) return <div className="text-center mt-20">Loading Delicious Foods...</div>;

  return (
    <div className="bg-[#fcfaf8] min-h-screen p-6 md:p-10 font-sans max-w-7xl mx-auto">
      
      {/* 1. Best Shops Section */}
      <section className="mb-12">
        <h2 className="text-[22px] font-medium text-gray-800 mb-6">Best Shops</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array.isArray(shops) && shops.map((shop) => (
            <div key={shop.id} className="min-w-[140px] flex flex-col rounded-2xl border shadow-sm cursor-pointer hover:shadow-md transition">
              <img src={shop.image_url} alt={shop.name} className="h-28 w-full object-cover rounded-t-2xl" />
              <div className="text-center py-2 bg-[#e8e6e1]">
                <span className="text-[13px] font-bold text-gray-700">{shop.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Foods Section */}
      <section>
        <h2 className="text-[22px] font-medium text-gray-800 mb-6">Suggested Food Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(foods) && foods.map((food) => (
            <div key={food.id} className="bg-white rounded-2xl p-3 border shadow-sm hover:shadow-lg transition">
              <img src={food.image_url} alt={food.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              <h3 className="font-bold text-[15px]">{food.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="font-black text-lg">₹ {food.price}</span>
                <div className="flex items-center border rounded-full h-9 overflow-hidden bg-white">
                  <button onClick={() => dispatch(decrementQuantity(food.id))} className="px-3 hover:bg-gray-100">-</button>
                  <span className="px-2 font-bold">{getQuantity(food.id)}</span>
                  <button onClick={() => dispatch(addToCart({ ...food, quantity: 1 }))} className="px-3 hover:bg-gray-100">+</button>
                  <button onClick={() => navigate('/cart')} className="bg-[#f05a28] text-white h-full px-3"><ShoppingCart size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;