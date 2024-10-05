import { db, collection, getDocs, doc, getDoc } from './firebase';
import { getDistance } from 'geolib';
import axios from 'axios'; // Make sure to install axios: npm install axios

const getPincodeCoordinates = async (pincode) => {
	try {
		const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
		if (response.data[0].Status === "Success") {
			const postOffice = response.data[0].PostOffice[0];
			return {
				latitude: parseFloat(postOffice.Latitude),
				longitude: parseFloat(postOffice.Longitude)
			};
		}
		return null;
	} catch (error) {
		console.error('Error fetching pincode coordinates:', error);
		return null;
	}
};

export const fetchMenuItems = async () => {
    const menuSnapshot = await getDocs(collection(db, 'fs_food_items','fs_food_items1'));
    return menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchHotels = async () => {
    const hotelsSnapshot = await getDocs(collection(db, 'fs_hotels'));
    return hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchAllItems = async () => {
    try {
        const itemsCollection = collection(db, 'fs_food_items');
        const itemsSnapshot = await getDocs(itemsCollection);
        return itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching all items:', error);
        throw error;
    }
};

export const fetchAllMedicalItems = async () => {
	try {
		const categoriesSnapshot = await getDocs(collection(db, 'medical_eqipment_categories1'));
		const categories = await Promise.all(categoriesSnapshot.docs.map(async (categoryDoc) => {
			const categoryData = categoryDoc.data();
			const dataCollectionRef = collection(categoryDoc.ref, 'data');
			const providersSnapshot = await getDocs(dataCollectionRef);
			const providers = providersSnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
				Categories: categoryDoc.id
			}));
			return {
				id: categoryDoc.id,
				...categoryData,
				type: 'category',
				providers: providers
			};
		}));

		return categories;
	} catch (error) {
		console.error('Error fetching items:', error);
		throw error;
	}
};

export const fetchMedicareData = async (userLat, userLon) => {
	try {
		const categoriesSnapshot = await getDocs(collection(db, 'medical_eqipment_categories1'));
		const categories = await Promise.all(categoriesSnapshot.docs.map(async (categoryDoc) => {
			const categoryData = categoryDoc.data();
			const dataCollectionRef = collection(categoryDoc.ref, 'data');
			const itemsSnapshot = await getDocs(dataCollectionRef);
			const items = {};
			itemsSnapshot.docs.forEach(doc => {
				items[doc.data().Name] = doc.data().image_url;
			});
			const providers = await Promise.all(itemsSnapshot.docs.map(async (doc) => {
				const providerData = doc.data();
				let distance = 'N/A';
				if (userLat && userLon && providerData.Pincode) {
					const providerCoords = await getPincodeCoordinates(providerData.Pincode);
					if (providerCoords) {
						distance = getDistance(
							{ latitude: userLat, longitude: userLon },
							providerCoords
						) / 1000; // Convert meters to kilometers
					}
				}
				return {
					id: doc.id,
					...providerData,
					distance: distance
				};
			}));
			return {
				id: categoryDoc.id,
				name: categoryData.name,
				items: items,
				providers: providers
			};
		}));

		return categories;
	} catch (error) {
		console.error('Error fetching Medicare data:', error);
		throw error;
	}
};