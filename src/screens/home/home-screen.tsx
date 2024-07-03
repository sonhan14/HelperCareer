import { FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { useEffect, useState } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Mapbox, { Image, Images, LocationPuck, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import firestore from '@react-native-firebase/firestore';
import { getDistance, getPreciseDistance } from 'geolib';
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from 'axios';
import auth from '@react-native-firebase/auth';

interface Location {
    latitude: number;
    longitude: number;
    id: string
}

interface Feature {
    id: string;
    full_address: string;
    center: [number, number];
}

type HomeScreenRouteProp = StackNavigationProp<RootStackParamList>;
Mapbox.setAccessToken('sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg');

export const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenRouteProp>()
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [taskGeoJsonData, setTaskGeoJsonData] = useState<any>(null);
    const [query, setQuery] = useState<string>('');
    const currentUser = auth().currentUser


    const fetchUserLocations = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('users')
                .where('role', '==', 'employee')
                .get();

            const taskQuerySnapshot = await firestore()
                .collection('tasks')
                .where('user_id', '==', currentUser?.uid)
                .get();

            const locations: Location[] = [];
            const taskLocations: Location[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.location) {
                    locations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                    });
                }
            });

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.location) {
                    taskLocations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                    });
                }
            });

            // const filteredLocations = locations.filter(loc => {
            //     const distance = getDistance(
            //         { latitude: loc.latitude, longitude: loc.longitude },
            //         { latitude: userLocation[1], longitude: userLocation[0] }
            //     );
            //     const distanceInKm = distance / 1000; // Chuyển đổi từ mét sang kilômét
            //     return distanceInKm <= 5; // Lọc ra các vị trí cách 3km hoặc ít hơn
            // });
            // setUserLocations(locations);
            const geoJson = convertToGeoJson(locations);
            const taskGeoJson = convertToGeoJson(taskLocations);

            console.log(taskGeoJson);
            
            setGeoJsonData(geoJson);
            setTaskGeoJsonData(taskGeoJson)
        } catch (error) {
            console.error('Error fetching locations from Firestore: ', error);
        }
    };

    const convertToGeoJson = (locations: Location[]): GeoJSON.FeatureCollection<GeoJSON.Point> => {
        const features: GeoJSON.Feature<GeoJSON.Point>[] = locations.map(location => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude]
            },
            properties: {
                title: 'Employee Location',
                userId: location.id, // Add user ID
            }
        }));

        return {
            type: 'FeatureCollection',
            features: features
        };
    };


    useEffect(() => {
        fetchUserLocations();
    }, []);

    const handlePress = (event: any): void => {
        const features = event.features;
        if (features.length > 0) {
            const userId = features[0].properties.userId;

            navigation.navigate('EmployeeProfile', { employeeId: userId })
        }
    };




    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for an address"
                    value={query}
                    onChangeText={() => {}}
                />
                <Mapbox.MapView style={styles.map} >
                    <Mapbox.Camera
                        followZoomLevel={11}
                        followUserLocation
                    />
                    <LocationPuck puckBearingEnabled puckBearing='heading' />
                    {geoJsonData && (
                        <ShapeSource id="employee_locations" shape={geoJsonData} onPress={handlePress}>

                            <SymbolLayer
                                id="employee_locations"
                                style={{ iconImage: 'avatar', iconSize: 0.6, iconAnchor: 'bottom', iconAllowOverlap: true, }} // Adjust iconSize as needed
                            />
                            <Mapbox.Images images={{ avatar: images.avartar_pic }}>

                            </Mapbox.Images>
                        </ShapeSource>
                    )}
                    {taskGeoJsonData && (
                        <ShapeSource id="task_locations" shape={taskGeoJsonData} onPress={() => {}}>
                                
                            <SymbolLayer
                                id="task_locations"
                                style={{ iconImage: 'taskImage', iconSize: 0.25, iconAnchor: 'bottom', iconAllowOverlap: true, }} // Adjust iconSize as needed
                            />
                            <Mapbox.Images images={{ taskImage: images.task_image }}>

                            </Mapbox.Images>
                        </ShapeSource>
                    )}
                </Mapbox.MapView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        height: layout.height,
        width: layout.width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: layout.height,
        width: layout.width,
        position: 'relative'

    },
    map: {
        flex: 1,

    },
    input: {
        height: 40,
        width: layout.width,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'white'
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
})