import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ArrowLeft } from 'lucide-react';
import { addToCart, decrementQuantity, removeFromCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  
  const handleCheckout = (e) => {
    e.preventDefault(); // पेज रिफ्रेस हुनबाट रोक्छ

    if (!token) {
      alert('Please log in before checkout.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (role !== 'user') {
      alert('Checkout is available only for customer accounts. Please log in as a user account.');
      return;
    }

    navigate('/checkout'); // चेकआउट पेजमा लैजान्छ
  };

  if (cartItems.length === 0) {
    return <div className="p-10 text-center text-gray-500">तपाईंको कार्ट खाली छ! 🍔</div>;
  }

  return (
    <div className="bg-[#fcfaf8] min-h-screen p-6 md:p-10 font-sans max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 font-bold">
        <ArrowLeft size={20} /> Back
      </button>
      <h2 className="text-2xl font-black mb-8">Your Cart</h2>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
            <div>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className="text-xs text-gray-500">₹ {item.price} x {item.quantity}</p>
              <p className="font-black text-[#f05a28]">₹ {item.price * item.quantity}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => dispatch(decrementQuantity(item.id))} className="bg-gray-100 p-2 rounded-lg">-</button>
            <span className="font-bold">{item.quantity}</span>
            <button type="button" onClick={() => dispatch(addToCart(item))} className="bg-gray-100 p-2 rounded-lg">+</button>
            <button type="button" onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500 ml-2"><Trash2 size={20} /></button>
          </div>
        </div>
      ))}

      {/* Total Amount Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center mt-6">
        <span className="font-black text-lg text-gray-800">Total Amount</span>
        <span className="font-black text-[#f05a28] text-2xl">₹ {totalAmount}</span>
      </div>

      {/* Checkout Button */}
      <button 
        type="button" 
        onClick={handleCheckout} 
        disabled={role !== 'user'}
        className="w-full bg-[#f05a28] hover:bg-[#e04a1e] text-white font-black py-4 rounded-xl mt-6 transition"
      >
        Proceed to CheckOut
      </button>
    </div>
  );
};

export default Cart;