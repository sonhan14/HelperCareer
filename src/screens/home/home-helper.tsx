// File: helpers.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Location } from '../../../types/homeTypes';


export const fetchUserLocations = (currentUser: any, setGeoJsonData: any, setTaskGeoJsonData: any) => {
    const unsubscribeUsers = firestore()
        .collection('users')
        .where('role', '==', 'employee')
        .onSnapshot(async (querySnapshot) => {
            const locations: Location[] = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location) {
                    locations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                        name: data.last_name + ' ' + data.first_name
                    });
                }
            });

            const geoJson = convertToGeoJson(locations);
            setGeoJsonData(geoJson);
        }, (error) => {
            console.error('Error fetching user locations from Firestore: ', error);
        });

    const unsubscribeTasks = firestore()
        .collection('tasks')
        .where('user_id', '==', currentUser?.uid)
        .onSnapshot(async (taskQuerySnapshot) => {
            const taskLocations: Location[] = [];

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location) {
                    taskLocations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                        name: data.task_name
                    });
                }
            });

            const taskGeoJson = convertToGeoJson(taskLocations);
            setTaskGeoJsonData(taskGeoJson);
        }, (error) => {
            console.error('Error fetching task locations from Firestore: ', error);
        });

    return () => {
        unsubscribeUsers();
        unsubscribeTasks();
    };
};

export const convertToGeoJson = (locations: Location[]): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = locations.map(location => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
        },
        properties: {
            title: location.name,
            userId: location.id, // Add user ID
        }
    }));

    return {
        type: 'FeatureCollection',
        features: features
    };
};
