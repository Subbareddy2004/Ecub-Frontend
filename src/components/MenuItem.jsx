import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const MenuItem = ({ item, addToCart }) => {
    const [quantity, setQuantity] = useState(0);

    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart(item, quantity);
            setQuantity(0);
        }
    };

    return (
        <div className="menu-item">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p className="price">₹{item.price}</p>
            </div>
            <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(0, quantity - 1))}><FaMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}><FaPlus /></button>
            </div>
            <button onClick={handleAddToCart} className="add-to-cart" disabled={quantity === 0}>
                Add to Cart
            </button>
        </div>
    );
};

export default MenuItem;