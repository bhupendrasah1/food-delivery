import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 1. Import Redux hook

const KhaltiPayment = () => {
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  
  
  const cartItems = useSelector((state) => state.cart.items);
  
  
  
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to Khalti
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment Successful!");
      
      // Redirect to your success/order page after payment
      navigate('/order'); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Khalti Header */}
        <div className="bg-[#5C2D91] p-6 text-center">
          <h2 className="text-3xl font-black text-white tracking-wide">KHALTI</h2>
          <p className="text-purple-200 text-sm mt-1 font-medium">Safe & Secure Online Payment</p>
        </div>

        {/* Payment Form */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <span className="text-gray-500 font-medium">Total Amount</span>
            {/* 4. Display dynamic total here */}
            <span className="text-2xl font-black text-gray-800">Rs. {totalAmount}</span>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Khalti Mobile Number
              </label>
              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Khalti PIN
              </label>
              <input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-bold py-4 rounded-xl mt-4 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
            >
              {/* 5. Display dynamic total inside the button */}
              {isLoading ? 'Processing...' : `Pay Rs. ${totalAmount}`}
            </button>
          </form>

          <button 
            onClick={() => navigate(-1)}
            className="w-full mt-4 text-gray-500 font-bold py-3 hover:text-gray-800 transition-colors"
          >
            Cancel Payment
          </button>
        </div>
      </div>

    </div>
  );
};

export default KhaltiPayment;