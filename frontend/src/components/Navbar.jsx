import React from 'react';
import { MapPin, Search, ShoppingCart, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="food-container flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25">
            <ChefHat size={22} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">
              Food delivery
            </p>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Vingo
            </h1>
          </div>
        </Link>

        <div className="order-3 flex w-full flex-1 items-center gap-3 lg:order-2 lg:max-w-3xl">
          <div className="flex min-w-[128px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm">
            <MapPin size={18} className="text-orange-500" />
            <span className="text-sm font-medium">Dharan</span>
          </div>

          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search for momo, pizza, burgers..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3">
          <Link
            to="/owner-dashboard"
            className="secondary-button hidden border-dashed px-4 py-2.5 text-sm lg:inline-flex"
          >
            Dashboard
          </Link>

          <Link
            to="/delivery-dashboard"
            className="secondary-button hidden border-dashed px-4 py-2.5 text-sm xl:inline-flex"
          >
            Delivery
          </Link>

          <Link
            to="/orders"
            className="secondary-button px-4 py-2.5 text-sm"
          >
            My Orders
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 transition hover:-translate-y-0.5 hover:bg-orange-100"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md shadow-rose-500/25">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/15 sm:flex">
            A
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;