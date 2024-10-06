import React, { useState } from 'react';
import { FaStar, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MenuItem = ({ item }) => {
    const [quantity, setQuantity] = useState(0);
    const { addToCart } = useAuth();

    const handleAddToCart = () => {
        if (quantity === 0) {
            setQuantity(1);
        }
        addToCart(item, quantity > 0 ? quantity : 1);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src={item.productImg} alt={item.productTitle} className="w-full h-48 object-cover" />
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold">{item.productTitle}</h3>
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded text-sm">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="font-semibold">{item.productRating ? item.productRating.toFixed(1) : 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FaUtensils className="mr-1 text-gray-400" />
                    <span>{item.hotelName}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.productDesc}</p>
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">₹{item.productPrice}</p>
                    {item.isVeg && (
                        <div className="border border-green-500 p-0.5 rounded">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                    )}
                </div>
                <div className="mt-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                        {quantity > 0 ? `Add (${quantity})` : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;