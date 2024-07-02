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
    const [userLocations, setUserLocations] = useState<Location[]>([])
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Feature[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Feature | null>(null);

    const fetchUserLocations = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('users')
                .where('role', '==', 'employee')
                .get();

            const locations: Location[] = [];
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
            setGeoJsonData(geoJson);
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

    const searchAddress = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            try {
                const response = await axios.get('https://api.mapbox.com/search/geocode/v6/forward', {
                    params: {
                        q: text,
                        access_token: 'sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg',
                        proximity: '105.7827,21.0285', // Center point in Hanoi
                        bbox: '102.14441,8.17966,109.46464,23.393395', // Bounding box around Vietnam
                        language: 'vi',
                        country: 'VN'
                    },
                });

                const features = response.data.features.map((feature: any) => ({
                    id: feature.id,
                    full_address: feature.properties.full_address,
                    center: feature.geometry.coordinates,
                }));
                console.log(features);

                setResults(features);
            } catch (error) {
                console.error('Error fetching data from Mapbox:', error);
            }
        } else {
            setResults([]);
        }
    };

    const selectLocation = (location: Feature) => {
        setSelectedLocation(location);
        setResults([]);
        setQuery(location.full_address);
    };


    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for an address"
                    value={query}
                    onChangeText={searchAddress}
                />
                {/* <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => selectLocation(item)}>
                            <Text>{item.full_address}</Text>
                        </TouchableOpacity>
                    )}
                /> */}
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