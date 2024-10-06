import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import { FaStar, FaLeaf, FaFilter, FaSpinner, FaArrowLeft } from 'react-icons/fa'; // Add FaArrowLeft
import { fetchAllItems } from '../services/firebaseOperations';
import { useAuth } from '../contexts/AuthContext';
import MenuItem from './MenuItem';

const AllItems = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        veg: false,
        priceRange: [0, 1000],
        rating: 0
    });
    const { userLocation } = useAuth(); // Assuming you have user location in AuthContext

    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            try {
                // Pass null for userLocation if it's not available
                const itemsData = await fetchAllItems(userLocation || null);
                setItems(itemsData);
                setFilteredItems(itemsData);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadItems();
    }, [userLocation]);

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Add the back link here */}
            <Link to="/food-order" className="flex items-center text-blue-600 mb-4">
                <FaArrowLeft className="mr-2" /> Back to Restaurants
            </Link>

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
                    <MenuItem key={item.id} item={item} />
                ))}
            </div>
            {filteredItems.length === 0 && (
                <p className="text-center text-gray-600 mt-4">No items match the current filters.</p>
            )}
        </div>
    );
};

export default AllItems;