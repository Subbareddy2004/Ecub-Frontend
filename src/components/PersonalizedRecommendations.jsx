import React, { useState, useEffect } from 'react';
import { getPersonalizedRecommendations } from '../services/api';
import { FaStar, FaLeaf, FaMinus, FaPlus } from 'react-icons/fa';

const MenuItem = ({ item, addToCart }) => {
    const [quantity, setQuantity] = useState(0);

    const handleAdd = () => {
        if (quantity > 0) {
            addToCart(item, quantity);
            setQuantity(0);
        }
    };

    return (
        <div className="menu-item">
            <div className="item-details">
                <h3>{item.productTitle || 'Unnamed Item'}</h3>
                <div className="rating">
                    <FaStar color="#FFD700" />
                    <span>{item.productRating ? item.productRating.toFixed(1) : 'N/A'} / 5</span>
                </div>
                <div className="price">
                    <span className="current-price">₹{item.productPrice || 'N/A'}</span>
                </div>
                <p className="description">{item.productDesc || 'No description available'}</p>
                <p>{item.isVeg ? <FaLeaf color="green" /> : 'Non-Veg'}</p>
                <div className="item-actions">
                    <div className="quantity-control">
                        <button onClick={() => setQuantity(Math.max(0, quantity - 1))}><FaMinus /></button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}><FaPlus /></button>
                    </div>
                    <button onClick={handleAdd} className="add-button" disabled={quantity === 0}>
                        ADD
                    </button>
                </div>
            </div>
            <img src={item.productImg || 'placeholder-image-url'} alt={item.productTitle || 'Menu Item'} className="item-image" />
        </div>
    );
};

const PersonalizedRecommendations = ({ searchQuery, addToCart, mealType }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (searchQuery || mealType) {
            fetchRecommendations(searchQuery, mealType);
        } else {
            setRecommendations([]);
        }
    }, [searchQuery, mealType]);

    const fetchRecommendations = async (query, meal) => {
        try {
            setLoading(true);
            const data = await getPersonalizedRecommendations(query, meal);
            setRecommendations(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching personalized recommendations:', error);
            setError('Failed to fetch recommendations');
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Finding the best dishes for you...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="personalized-recommendations">
            <h2>Personalized Recommendations</h2>
            {recommendations.length > 0 ? (
                <div className="menu-items">
                    {recommendations.map((item) => (
                        <MenuItem key={item.id} item={item} addToCart={addToCart} />
                    ))}
                </div>
            ) : (
                <p>{searchQuery ? `No recommendations found for "${searchQuery}". Try another search!` : 'Start typing to get personalized recommendations!'}</p>
            )}
        </div>
    );
};

export default PersonalizedRecommendations;