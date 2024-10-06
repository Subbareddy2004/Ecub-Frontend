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
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]); // Add this line

    useEffect(() => {
        const getUserLocationAndFetchData = async () => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const userLoc = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            setUserLocation(userLoc);
                            await fetchData(userLoc);
                        },
                        async (error) => {
                            console.error("Error getting user location:", error);
                            await fetchData(null);
                        }
                    );
                } else {
                    await fetchData(null);
                }
            } catch (error) {
                console.error("Error in getUserLocationAndFetchData:", error);
                setError("Failed to load data. Please try again.");
                setIsLoading(false);
            }
        };

        getUserLocationAndFetchData();
    }, []);

    const fetchData = async (userLoc) => {
        try {
            setIsLoading(true);
            const hotelsData = await fetchHotelsWithMenuItems(userLoc);
            setHotels(hotelsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("Failed to load hotels. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function
    const handleRecommendations = (newRecommendations) => {
        setRecommendations(newRecommendations);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 space-y-8">
                    <PopularItems userLocation={userLocation} />
                    <ChatBot 
                        onRecommendations={handleRecommendations} 
                        addToCart={(item, quantity) => {
                            console.log(`Added ${quantity} of ${item.productTitle} to cart`);
                            // Implement your addToCart logic here
                        }}
                        userLocation={userLocation}
                    />
                </div>
                <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Nearby Restaurants</h2>
                    {hotels.map(hotel => (
                        <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="mb-4 bg-white rounded-lg shadow-lg p-6 block hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
                                {hotel.distance !== null && hotel.distance !== undefined && (
                                    <span className="text-sm text-gray-600 flex items-center">
                                        <FaMapMarkerAlt className="mr-1" />
                                        {typeof hotel.distance === 'number' 
                                            ? `${hotel.distance.toFixed(2)} km away`
                                            : 'Distance unavailable'}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mt-2">{hotel.hotelType}</p>
                            <div className="flex items-center mt-2">
                                {hotel.hotelType === 'restaurant' ? (
                                    <FaUtensils className="text-gray-500 mr-2" />
                                ) : (
                                    <FaHome className="text-gray-500 mr-2" />
                                )}
                                <span>{hotel.hotelType === 'restaurant' ? 'Restaurant' : 'Homemade'}</span>
                            </div>
                            {hotel.hotelAddress && (
                                <p className="text-gray-600 mt-2">{hotel.hotelAddress}</p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodOrderHome;