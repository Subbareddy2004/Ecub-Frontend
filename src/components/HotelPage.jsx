import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchHotelDetails } from '../services/firebaseOperations';
import MenuItem from './MenuItem';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const HotelPage = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filters, setFilters] = useState({
        vegOnly: false,
        minRating: 0,
        maxPrice: 1000
    });

    useEffect(() => {
        const loadHotelDetails = async () => {
            try {
                const hotelData = await fetchHotelDetails(id);
                console.log('Fetched hotel data:', hotelData); // Debug log
                setHotel(hotelData);
                if (hotelData.menuItems && hotelData.menuItems.length > 0) {
                    console.log('Menu items:', hotelData.menuItems); // Debug log
                    setFilteredItems(hotelData.menuItems);
                } else {
                    console.log('No menu items found for this hotel'); // Debug log
                }
            } catch (error) {
                console.error('Error loading hotel details:', error);
            }
        };
        loadHotelDetails();
    }, [id]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    useEffect(() => {
        if (hotel) {
            const filtered = hotel.menuItems.filter(item => 
                (!filters.vegOnly || item.isVeg) &&
                item.productRating >= filters.minRating &&
                item.productPrice <= filters.maxPrice
            );
            setFilteredItems(filtered);
        }
    }, [filters, hotel]);

    if (!hotel) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/food-order" className="flex items-center text-blue-600 mb-4">
                <FaArrowLeft className="mr-2" /> Back to Restaurants
            </Link>
            <h1 className="text-3xl font-bold mb-4">{hotel.hotelName}</h1>
            <div className="mb-4">
                <p className="text-gray-600">{hotel.hotelType}</p>
                <div className="flex items-center mt-2">
                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                    <span>{hotel.hotelAddress}</span>
                </div>
                <div className="flex items-center mt-2">
                    <FaPhone className="text-gray-500 mr-2" />
                    <span>{hotel.hotelPhoneNo}</span>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Filters</h2>
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.vegOnly}
                            onChange={(e) => handleFilterChange('vegOnly', e.target.checked)}
                            className="mr-2"
                        />
                        Veg Only
                    </label>
                    <div>
                        <label className="block">Minimum Rating</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={filters.minRating}
                            onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <span>{filters.minRating}</span>
                    </div>
                    <div>
                        <label className="block">Max Price</label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="50"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                            className="w-full"
                        />
                        <span>₹{filters.maxPrice}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <MenuItem 
                            key={item.id} 
                            item={item} 
                            addToCart={(item, quantity) => {
                                console.log(`Added ${quantity} of ${item.productTitle} to cart`);
                            }}
                        />
                    ))
                ) : (
                    <p>No menu items available for this hotel.</p>
                )}
            </div>
        </div>
    );
};

export default HotelPage;