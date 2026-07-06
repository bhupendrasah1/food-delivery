import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, MapPin, Phone, CheckCircle, Navigation, RefreshCw, Truck, Clock3 } from 'lucide-react';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { connectSocket, disconnectSocket } from '../services/socket';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DeliveryDashboard = () => {
  // 1. ADDED: Missing state declarations
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    const handleOrdersChanged = () => {
      fetchOrders();
    };

    socket.on('orders:changed', handleOrdersChanged);

    return () => {
      socket.off('orders:changed', handleOrdersChanged);
      disconnectSocket();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/delivery`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrders(response.data || []);

      if ((response.data || []).length > 0) {
        setSelectedOrder(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Update status in the backend
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Update React state
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      );

      setOrders(updatedOrders);

      // Update selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Unable to update order status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#f05a28] p-3 rounded-xl text-white shadow-md">
              <Truck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Delivery Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage and track your assigned deliveries</p>
            </div>
          </div>
          <button onClick={fetchOrders} className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-50">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Active orders</p>
            <p className="text-2xl font-black text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Picked up</p>
            <p className="text-2xl font-black text-blue-600">{orders.filter((o) => o.status === 'Picked Up').length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-xs font-bold mb-1">Delivered</p>
            <p className="text-2xl font-black text-green-600">{orders.filter((o) => o.status === 'Delivered').length}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Orders List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="font-bold text-gray-700 text-lg mb-2">Assigned Orders</h2>
            
            {loading ? (
              <div className="p-5 rounded-2xl border border-gray-200 bg-white text-gray-500 text-center">
                Loading delivery orders...
              </div>
            ) : orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedOrder?.id === order.id 
                    ? 'border-[#f05a28] bg-orange-50 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-orange-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-black text-gray-800">{order.id}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Picked Up' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#f05a28]'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-700 text-sm">{order.customer_name}</h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-1">{order.address}</p>
              </div>
            ))}

            {!loading && orders.length === 0 && (
              <div className="p-5 rounded-2xl border border-gray-200 bg-white text-gray-500 text-center">
                No active delivery orders found.
              </div>
            )}
          </div>

          {/* Right Column: Map and Order Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* 2. ADDED: Null check to prevent crashes before data loads */}
            {!selectedOrder ? (
              <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex items-center justify-center p-10 text-gray-400">
                Select an order to view details
              </div>
            ) : (
              <>
                {/* Map Container */}
                <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 h-[400px] z-0 overflow-hidden">
                  <MapContainer 
                    key={selectedOrder.id} 
                    center={[Number(selectedOrder.latitude) || 27.7172, Number(selectedOrder.longitude) || 85.3240]} 
                    zoom={14} 
                    className="w-full h-full rounded-2xl"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[Number(selectedOrder.latitude) || 27.7172, Number(selectedOrder.longitude) || 85.3240]}>
                      <Popup>
                        <b className="text-[#f05a28]">{selectedOrder.customer_name}</b><br/>
                        {selectedOrder.address}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Order Details Card */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                    
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-xl font-black text-gray-800 mb-4">Delivery Details</h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="bg-orange-100 p-2 rounded-full text-[#f05a28]"><MapPin size={18} /></div>
                          <span className="font-medium">{selectedOrder.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="bg-orange-100 p-2 rounded-full text-[#f05a28]"><Phone size={18} /></div>
                          <span className="font-medium">{selectedOrder.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 p-5 rounded-2xl md:w-64">
                      <p className="text-gray-500 text-xs font-bold mb-1">To Collect</p>
                      <p className="text-2xl font-black text-[#f05a28] mb-2">{selectedOrder.payment === 'Online Paid' ? '₹ 0' : `₹ ${selectedOrder.amount}`}</p>
                      <p className="text-xs font-medium text-gray-600">Payment: {selectedOrder.payment}</p>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-50 transition"
                      // 3. FIXED: Proper string interpolation and Google Maps URL
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${Number(selectedOrder.latitude) || 27.7172},${Number(selectedOrder.longitude) || 85.3240}`)}
                    >
                      <Navigation size={20} />
                      Get Directions
                    </button>

                    {selectedOrder.status === 'Pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'Picked Up')}
                        className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-md"
                      >
                        Mark as Picked Up
                      </button>
                    )}

                    {selectedOrder.status === 'Picked Up' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                        className="flex-1 bg-[#f05a28] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#e04a1e] transition shadow-md"
                      >
                        <CheckCircle size={20} />
                        Complete Delivery
                      </button>
                    )}

                    {selectedOrder.status === 'Delivered' && (
                      <div className="flex-1 bg-green-100 text-green-700 py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                        <CheckCircle size={20} />
                        Successfully Delivered
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;