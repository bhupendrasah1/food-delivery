import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleKhaltiPayment = async () => {
    navigate('/checkout');
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-2xl p-6 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag /> Your Cart
        </h2>
        <button onClick={onClose}><X size={24} /></button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty! 🍔</p>
      ) : (
        <div className="space-y-4">
          {/* कार्टका सामानहरू */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-orange-500">रु {item.price}</p>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500">
                Remove
              </button>
            </div>
          ))}

          {/* टोटल मूल्य यहाँ देखिनेछ */}
          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
            <span>Total:</span>
            <span className="text-orange-600">रु {total}</span>
          </div>

          <button
            onClick={handleKhaltiPayment}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            Continue to Checkout 💳
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;