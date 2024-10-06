import { getDistance } from 'geolib';

export const calculateDistance = (point1, point2) => {
    if (!point1 || !point2 || !point1.latitude || !point1.longitude || !point2.latitude || !point2.longitude) {
        return null;
    }
    return getDistance(
        { latitude: point1.latitude, longitude: point1.longitude },
        { latitude: point2.latitude, longitude: point2.longitude }
    ) / 1000; // Convert meters to kilometers
};