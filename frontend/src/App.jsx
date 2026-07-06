import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import FoodDetailsPage from './pages/FoodDetailsPage';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import Checkout from "./pages/Checkout";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import KhaltiPayment from './pages/KhaltiPayment';
import AddFood from './pages/AddFood';
import AddShop from './pages/AddShop';
import OrderHistory from './pages/OrderHistory';
import PaymentSuccess from './components/PaymentSuccess';
import GoogleAuthCallback from './pages/GoogleAuthCallback';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* public routes*/}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/menu/:slug" element={<FoodDetailsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* User checkout flow */}
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/khalti-payment" element={<KhaltiPayment />} />
        <Route path="/order" element={<PaymentSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['user']}>
            <OrderHistory />
          </ProtectedRoute>
        } />

        {/* Owner can access */}
        <Route path="/owner-dashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-food" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddFood />
          </ProtectedRoute>
        } />
        <Route path="/add-shop" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddShop />
          </ProtectedRoute>
        } />

        {/* Delivery Boy can access */}
        <Route path="/delivery-dashboard" element={
          <ProtectedRoute allowedRoles={['deliveryBoy']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } />

        {/* Admin can access */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;