import { PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useEffect, useState } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import Mapbox, { Image, Images, LocationPuck, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import firestore from '@react-native-firebase/firestore';
import { getDistance, getPreciseDistance } from 'geolib';
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";

interface Location {
    latitude: number;
    longitude: number;
}
type HomeScreenRouteProp = RouteProp<RootTabParamList, 'Home'>;
Mapbox.setAccessToken('sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg');

export const HomeScreen = () => {
    const [userLocations, setUserLocations] = useState<Location[]>([]);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);


    const fetchUserLocations = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('profile')
                .where('role', '==', 'employee')
                .get();


            const locations: Location[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location) {
                    locations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
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

    const convertToGeoJson = (locations: Location[]): any => {
        const features = locations.map(location => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude]
            },
            properties: {
                title: 'Employee Location'
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



    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Mapbox.MapView style={styles.map} >
                    <Mapbox.Camera
                        followZoomLevel={14}
                        followUserLocation
                    />
                    <LocationPuck puckBearingEnabled puckBearing='heading' />

                    {geoJsonData && (
                        <ShapeSource id="employee_locations" shape={geoJsonData}>
                            
                            <SymbolLayer 
                                id="employee_locations"
                                style={{ iconImage: 'avatar', iconSize: 0.6 , iconAnchor: 'bottom', iconAllowOverlap: true, }} // Adjust iconSize as needed
                            />
                            <Mapbox.Images images={{avatar: images.avartar_pic}}>
                                    
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: layout.height,
        width: layout.width
    },
    map: {
        flex: 1
    }
})