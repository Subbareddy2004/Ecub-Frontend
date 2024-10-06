import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHotelsWithMenuItems } from '../services/firebaseOperations';
import PopularItems from './PopularItems';
import ChatBot from './ChatBot';
import { FaSpinner, FaMapMarkerAlt, FaUtensils, FaHome } from 'react-icons/fa';

const FoodOrderHome = () => {
    const [hotels, setHotels] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addToCart] = useState(() => {
        return (item, quantity) => {
            console.log(`Added ${quantity} of ${item.productTitle} to cart`);
        };
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    fetchData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

    const fetchData = async (lat, lon) => {
        try {
            const hotelsData = await fetchHotelsWithMenuItems(lat, lon);
            setHotels(hotelsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecommendations = (recs) => {
        console.log('Received recommendations in FoodOrderHome:', recs);
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
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 space-y-8">
                    <PopularItems userLocation={userLocation} />
                    <ChatBot userLocation={userLocation} onRecommendations={handleRecommendations} addToCart={addToCart} />
                </div>
                <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Nearby Restaurants</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hotels.map(hotel => (
                            <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="bg-white rounded-lg shadow-lg p-4 block hover:bg-gray-50 transition duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold truncate">{hotel.hotelName}</h3>
                                    {hotel.distance !== null && hotel.distance !== undefined && (
                                        <span className="text-sm text-gray-600 flex items-center bg-gray-100 px-2 py-1 rounded-full">
                                            <FaMapMarkerAlt className="mr-1" />
                                            {typeof hotel.distance === 'number' 
                                                ? `${hotel.distance.toFixed(1)} km`
                                                : 'N/A'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    {hotel.hotelType === 'restaurant' ? (
                                        <FaUtensils className="text-blue-500 mr-2" />
                                    ) : (
                                        <FaHome className="text-green-500 mr-2" />
                                    )}
                                    <span className="capitalize">{hotel.hotelType}</span>
                                </div>
                                {hotel.hotelAddress && (
                                    <p className="text-sm text-gray-600 truncate">{hotel.hotelAddress}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodOrderHome;