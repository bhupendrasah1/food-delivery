import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Heart } from 'lucide-react';

const FoodDetailsPage = () => {
  const { slug } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/items/${slug}`);
        
        if (res.ok) {
          const data = await res.json();
          setFood(data);
        } else {
          console.warn("Backend data not found, using sample data.");
          setFood({
            name: 'Momo',
            price: 150,
            description: 'Nepali style steamed dumplings filled with delicious meat or vegetables, served with a spicy dipping sauce.',
            image: 'https://images.unsplash.com/photo-1625220194760-356d4052cc4e?w=800',
            rating: 4.8,
            reviews: 120
          });
        }
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [slug]);

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (!food) return <div className="text-center mt-20 text-xl text-red-500">Food not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <Link to="/" className="flex items-center text-gray-500 hover:text-orange-500 mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back
      </Link>

      <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-2xl">
        <img src={food.image} alt={food.name} className="w-full h-80 object-cover rounded-3xl" />
        <div>
          <h1 className="text-4xl font-black text-gray-800">{food.name}</h1>
          <div className="flex items-center text-yellow-500 my-4">
            <Star size={20} fill="currentColor" />
            <span className="ml-2 font-bold text-gray-700">
              {food.rating} ({food.reviews} Reviews)
            </span>
          </div>
          <p className="text-gray-600 mb-6">{food.description}</p>
          <div className="text-3xl font-bold text-orange-600 mb-8">रु {food.price}</div>
          <div className="flex gap-4">
            <button className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:text-red-500 transition">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;