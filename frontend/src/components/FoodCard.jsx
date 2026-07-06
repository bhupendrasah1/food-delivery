import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    dispatch(addToCart(food));
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      
      <Link to={`/menu/${food.slug}`} className="block overflow-hidden rounded-2xl mb-4">
        <img 
          src={food.image} 
          alt={food.name} 
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
        />
      </Link>
      
      <div className="flex-grow">
        <Link to={`/menu/${food.slug}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-1 hover:text-orange-500 transition-colors">
            {food.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-4">
          Fresh and delicious {food.category.toLowerCase()} made with love.
        </p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <span className="text-2xl font-black text-gray-900">Rs. {food.price}</span>
        <button 
          onClick={handleAddToCart}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-md"
        >
          Add to Cart
        </button>
      </div>
      
    </div>
  );
};

export default FoodCard;