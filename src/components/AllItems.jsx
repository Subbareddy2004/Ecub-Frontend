import React, { useState, useEffect } from 'react';
import { FaStar, FaLeaf, FaFilter, FaSpinner } from 'react-icons/fa';
import { fetchAllItems } from '../services/firebaseOperations';
import { useAuth } from '../contexts/AuthContext'; // Add this import

const AllItems = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        veg: false,
        priceRange: [0, 1000],
        rating: 0
    });
    const { addToCart } = useAuth(); // Add this line to get addToCart function

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            try {
                const itemsData = await fetchAllItems();
                setItems(itemsData);
                setFilteredItems(itemsData);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, []);

    useEffect(() => {
        const filtered = items.filter(item => 
            (!filters.veg || item.isVeg) &&
            item.productPrice >= filters.priceRange[0] &&
            item.productPrice <= filters.priceRange[1] &&
            item.productRating >= filters.rating
        );
        setFilteredItems(filtered);
    }, [filters, items]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleAddToCart = (item) => {
        addToCart(item, 1); // Add 1 quantity of the item to the cart
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#FF6B35]" />
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            
            <div className="mb-8 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaFilter className="mr-2 text-[#FF6B35]" /> Filters
                </h2>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.veg}
                            onChange={(e) => handleFilterChange('veg', e.target.checked)}
                            className="mr-2"
                        />
                        Vegetarian Only
                    </label>
                    <div>
                        <label className="block mb-2">Price Range</label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={filters.priceRange[1]}
                            onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                            className="w-full"
                        />
                        <div className="flex justify-between">
                            <span>₹0</span>
                            <span>₹{filters.priceRange[1]}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Minimum Rating</label>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                            className="p-2 border rounded"
                        >
                            <option value="0">All Ratings</option>
                            <option value="3">3+ Stars</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                        <img src={item.productImg} alt={item.productTitle} className="w-full h-48 object-cover rounded-t-lg" />
                        <h3 className="text-xl font-semibold mt-4">{item.productTitle}</h3>
                        <p className="text-gray-600 mt-2">{item.productDesc}</p>
                        <div className="flex items-center mt-2">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{item.productRating.toFixed(1)}</span>
                        </div>
                        <p className="text-lg font-bold mt-2">₹{item.productPrice}</p>
                        {item.isVeg && <FaLeaf className="text-green-500 mt-2" />}
                        <button 
                            onClick={() => handleAddToCart(item)}
                            className="w-full bg-[#FF6B35] text-white px-4 py-2 rounded hover:bg-[#F7C59F] hover:text-[#004E89] transition duration-300 mt-4"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllItems;