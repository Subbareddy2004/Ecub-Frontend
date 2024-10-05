import React, { useState } from 'react';
import { FaPlus, FaMinus, FaStar, FaStore } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MenuItem = ({ item }) => {
    const [quantity, setQuantity] = useState(0);
    const { addToCart } = useAuth();

    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart(item, quantity);
            setQuantity(0);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <img src={item.productImg} alt={item.productTitle} className="w-full h-48 object-cover rounded-t-lg" />
            <h3 className="text-xl font-semibold mt-2">{item.productTitle}</h3>
            {item.hotelName && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                    <FaStore className="mr-1" /> {item.hotelName}
                </p>
            )}
            <p className="text-sm text-gray-600 mt-1">{item.productDesc}</p>
            <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{item.productRating ? item.productRating.toFixed(1) : 'N/A'}</span>
            </div>
            <p className="text-lg font-bold mt-2">₹{item.productPrice}</p>
            {item.isVeg && <span className="text-green-600">Veg</span>}
            <p className="text-sm text-gray-600">Prep time: {item.productPrepTime}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="bg-gray-200 px-2 py-1 rounded">
                        <FaMinus />
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-200 px-2 py-1 rounded">
                        <FaPlus />
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                    disabled={quantity === 0}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MenuItem;