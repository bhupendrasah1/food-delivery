import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/api';
import { clearCart } from '../features/cartSlice';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, role, token: storedToken } = useSelector((state) => state.auth);
  const token = storedToken || localStorage.getItem('token');

  const [address, setAddress] = useState("Kathmandu");
  const [paymentMethod, setPaymentMethod] = useState("cod"); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
      return;
    }

    if (role && role !== 'user') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, role, token, navigate]);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!token || !isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        items: cartItems.map((item) => ({
          item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: totalAmount,
        delivery_address: address,
        latitude: 27.7172,
        longitude: 85.3240,
        payment_method: paymentMethod,
      };

      const orderResponse = await API.post('/api/orders', payload);
      const orderId = orderResponse.data?.order?.id;

      if (!orderId) {
        throw new Error('Order was created but no order id was returned.');
      }

      if (paymentMethod === 'khalti') {
        const paymentResponse = await API.post('/api/payment/initiate', { order_id: orderId });

        if (paymentResponse.data?.payment_url) {
          window.location.href = paymentResponse.data.payment_url;
          return;
        }

        throw new Error('Payment gateway did not return a redirect URL.');
      }

      dispatch(clearCart());
      navigate(`/payment-success?orderId=${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      const backendMessage = error.response?.data?.message;
      const backendDetail = error.response?.data?.detail;
      const finalMessage = backendDetail
        ? `${backendMessage || 'Checkout failed'}\n\nDetail: ${typeof backendDetail === 'string' ? backendDetail : JSON.stringify(backendDetail)}`
        : backendMessage || error.message || 'Unable to place order.';

      alert(finalMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#fcfaf8] min-h-screen font-sans">
      
      {/* Delivery Location */}
      <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm">
        <label className="font-bold block mb-2 text-gray-800">Delivery Location</label>
        <input 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:border-orange-500 transition-colors" 
        />
        <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 z-0 relative">
           <MapContainer center={[27.7172, 85.3240]} zoom={13} className="h-full w-full">
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[27.7172, 85.3240]} />
          </MapContainer>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div 
          onClick={() => setPaymentMethod("cod")}
          className={`flex-1 p-5 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "cod" 
              ? "border-2 border-orange-500 bg-orange-50 text-orange-900" 
              : "border border-gray-300 bg-white hover:border-orange-300"
          }`}
        >
          <p className="font-bold text-center">Cash On Delivery</p>
        </div>
        
        <div 
          onClick={() => setPaymentMethod("khalti")}
          className={`flex-1 p-5 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "khalti" 
              ? "border-2 border-purple-600 bg-purple-50 text-purple-900" 
              : "border border-gray-300 bg-white hover:border-purple-300"
          }`}
        >
          <p className="font-bold text-center">Payment with khalti</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm">
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items in your cart.</p>
        ) : (
          <>
            {/* Loop through Redux cart items */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-3 text-gray-700 border-b border-gray-50 last:border-0">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            
            {/* Total Display */}
            <div className="flex justify-between py-3 font-black text-xl border-t border-gray-200 mt-2 text-gray-900">
              <span>totalAmount</span>
              <span>₹{totalAmount}</span>
            </div>
          </>
        )}
      </div>

      {/* Place Order Button */}
      <button  
        onClick={handlePlaceOrder}
        disabled={cartItems.length === 0 || isSubmitting}
        className="w-full bg-[#f05a28] hover:bg-[#e04a1e] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-white py-4 rounded-xl font-black text-lg shadow-md"
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
      
    </div>
  );
};

export default Checkout;