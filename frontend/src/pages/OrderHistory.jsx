import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orderSlice";

const OrderHistory = () => {
  const dispatch = useDispatch();

  const { list: orders, status, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="p-10 text-center text-xl">
        Loading orders...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h2 className="text-3xl font-bold mb-6">
        My Orders 📦
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 border rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">
                  Order #{order.id}
                </p>

                <p className="text-gray-500">
                  Status: {order.status}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-orange-500 text-lg">
                  रु {order.total_amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;