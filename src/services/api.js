import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const sendMessage = async (message, mealType) => {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message,
        mealType
    });
    return response.data;
};

export const getPersonalizedRecommendations = async (query, mealType) => {
    try {
        const response = await sendMessage(query, mealType);
        return response.recommendations;
    } catch (error) {
        console.error('Error getting personalized recommendations:', error);
        throw error; // Propagate the error to be handled in the component
    }
};

export const fetchPopularItems = async () => {
    const response = await fetch(`${API_BASE_URL}/api/popular-items`);
    if (!response.ok) {
        throw new Error('Failed to fetch popular items');
    }
    return response.json();
};

export const getPopularItems = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/popular-items`);
    return response.data;
};

export const getNearbyHotels = async (latitude, longitude) => {
    const response = await axios.get(`${API_BASE_URL}/api/nearby-hotels`, {
        params: { latitude: latitude.toString(), longitude: longitude.toString() }
    });
    return response.data;
};
