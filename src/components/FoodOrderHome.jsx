import React, { useState } from 'react';
import PopularItems from './PopularItems';
import AllItems from './AllItems';
import Hotels from './Hotels';
import ChatBot from './ChatBot';
import { FaSpinner } from 'react-icons/fa';

const FoodOrderHome = ({ popularItems, isLoadingItems, addToCart, handleRecommendations }) => {
    const [showAllItems, setShowAllItems] = useState(false);

    return (
        <div className="relative bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-blue-800">
                                    {showAllItems ? "All Items" : "Popular Items"}
                                </h2>
                                <button
                                    onClick={() => setShowAllItems(!showAllItems)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                                >
                                    {showAllItems ? "Show Popular Items" : "Show All Items"}
                                </button>
                            </div>
                            {isLoadingItems ? (
                                <div className="flex justify-center items-center h-64">
                                    <FaSpinner className="animate-spin text-4xl text-blue-600" />
                                </div>
                            ) : (
                                showAllItems ? (
                                    <AllItems addToCart={addToCart} />
                                ) : (
                                    <PopularItems items={popularItems} addToCart={addToCart} />
                                )
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-blue-800">Nearby Hotels</h2>
                            <Hotels />
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-4 right-4 z-50">
                <ChatBot onRecommendations={handleRecommendations} addToCart={addToCart} />
            </div>
        </div>
    );
};

export default FoodOrderHome;