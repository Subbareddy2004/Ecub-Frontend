import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { fetchPopularItemsWithHotelInfo } from '../services/firebaseOperations';

const PopularItems = ({ userLocation }) => {
    const [popularItems, setPopularItems] = useState([]);

    useEffect(() => {
        const loadPopularItems = async () => {
            if (userLocation && userLocation.latitude && userLocation.longitude) {
                try {
                    const items = await fetchPopularItemsWithHotelInfo(userLocation);
                    setPopularItems(items);
                } catch (error) {
                    console.error('Error loading popular items:', error);
                }
            } else {
                console.warn('User location is not available or incomplete');
            }
        };
        loadPopularItems();
    }, [userLocation]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Popular Items</h2>
            <div className="grid grid-cols-2 gap-4">
                {popularItems.map(item => (
                    <MenuItem 
                        key={item.id} 
                        item={item} 
                        hotelName={item.hotelName}
                        hotelDistance={item.hotelDistance}
                        addToCart={(item, quantity) => {
                            console.log(`Added ${quantity} of ${item.productTitle} to cart`);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PopularItems;