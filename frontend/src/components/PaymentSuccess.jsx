import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart } from '../features/cartSlice';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6 bg-[#fcfaf8]">
      <h1 className="text-4xl text-green-500 font-black">Congratulations! 🎉</h1>
      <p className="mt-3 text-gray-600 text-lg">
        Your order {orderId ? `#${orderId} ` : ''}has been confirmed and is moving forward.
      </p>
      <p className="mt-2 text-gray-500">
        The delivery dashboard updates automatically when the payment is confirmed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/orders" className="px-5 py-3 rounded-xl bg-[#f05a28] text-white font-bold">
          View Orders
        </Link>
        <Link to="/" className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;