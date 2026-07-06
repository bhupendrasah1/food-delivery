import React, { useState } from 'react';
import { LayoutDashboard, Users, Store, ShoppingBag, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // डमी डाटाहरू (पछि API बाट आउनेछन्)
  const stats = {
    totalRevenue: '₹ 45,230',
    totalOrders: 156,
    totalUsers: 84,
    totalShops: 12
  };

  const recentOrders = [
    { id: '#ORD-1025', customer: 'Aarav Sharma', shop: 'Ayush Da Dhaba', amount: '₹ 450', status: 'Delivered' },
    { id: '#ORD-1026', customer: 'Sita Rai', shop: 'Pizza Hut', amount: '₹ 850', status: 'Pending' },
    { id: '#ORD-1027', customer: 'Ram Thapa', shop: 'Burger King', amount: '₹ 250', status: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen flex bg-[#fcfaf8] font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-3xl font-black text-[#f05a28]">Vingo <span className="text-gray-800 text-lg">Admin</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-[#f05a28] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f05a28]'}`}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#f05a28] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f05a28]'}`}
          >
            <ShoppingBag size={20} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('shops')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'shops' ? 'bg-[#f05a28] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f05a28]'}`}
          >
            <Store size={20} /> Restaurants
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-[#f05a28] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f05a28]'}`}
          >
            <Users size={20} /> Users
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-800 capitalize">{activeTab} Dashboard</h2>
          <p className="text-gray-500 text-sm">Welcome back, Super Admin!</p>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-2xl text-green-600"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">Total Revenue</p>
                  <h3 className="text-2xl font-black text-gray-800">{stats.totalRevenue}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><ShoppingBag size={24} /></div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">Total Orders</p>
                  <h3 className="text-2xl font-black text-gray-800">{stats.totalOrders}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-2xl text-purple-600"><Store size={24} /></div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">Total Shops</p>
                  <h3 className="text-2xl font-black text-gray-800">{stats.totalShops}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl text-[#f05a28]"><Users size={24} /></div>
                <div>
                  <p className="text-gray-500 text-sm font-bold">Total Users</p>
                  <h3 className="text-2xl font-black text-gray-800">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-800">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Customer</th>
                      <th className="p-4 font-bold">Shop</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-800">{order.id}</td>
                        <td className="p-4 text-gray-600">{order.customer}</td>
                        <td className="p-4 text-gray-600">{order.shop}</td>
                        <td className="p-4 font-bold text-gray-800">{order.amount}</td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'Delivered' && <CheckCircle size={14} />}
                            {order.status === 'Pending' && <Clock size={14} />}
                            {order.status === 'Cancelled' && <XCircle size={14} />}
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Other Tabs (Placeholder for future development) */}
        {activeTab !== 'overview' && (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Detailed {activeTab} section</h3>
            <p className="text-gray-500">This module will display a full list and management tools for {activeTab}.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;