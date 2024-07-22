import Mapbox, { LocationPuck } from "@rnmapbox/maps"
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { images } from "../../images"
import { layout } from "../../constants/dimensions/dimension"
import axios from "axios"
import { useEffect, useState } from "react"
import { Feature } from "../../../types/homeTypes"
import { useSelector } from "react-redux"
import { selectUserData } from "../../redux/user/userSlice"
import { color } from "../../constants/colors/color"
import firestore, { GeoPoint } from '@react-native-firebase/firestore';

type addressModal = {
    isAddress: boolean,
    closeModal: () => void
}



export const ProfileAdress = ({ isAddress, closeModal }: addressModal) => {
    const [selectedLocation, setSelectedLocation] = useState<Feature>();
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Feature[]>([]);
    const userData = useSelector(selectUserData)

    const searchStyle = useSharedValue({
        height: 40,
        width: (layout.width - 20) * 0.8,
        margintop: 10,
        borrderRadius: 20
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: searchStyle.value.width,
            height: searchStyle.value.height,
            marginTop: searchStyle.value.margintop,
            borderRadius: searchStyle.value.borrderRadius
        };
    });
    const searchAnimation = () => {
        searchStyle.value = withTiming({
            height: layout.height * 0.3,
            width: layout.width - 20,
            margintop: 0,
            borrderRadius: 0
        }, { duration: 500 })

    }

    const searchAddress = async (text: string) => {
        setQuery(text);
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
            setResults(features);
        } catch (error) {
            console.error('Error fetching data from Mapbox:', error);
        }
    };

    const ReverseGeocoding = async () => {
        try {
            if (userData) {
                const response = await axios.get('https://api.mapbox.com/search/geocode/v6/reverse', {
                    params: {
                        longitude: userData?.longitude,
                        latitude: userData?.latitude,
                        access_token: 'sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg',
                        proximity: '105.7827,21.0285', // Center point in Hanoi
                        bbox: '102.14441,8.17966,109.46464,23.393395', // Bounding box around Vietnam
                        language: 'vi',
                        country: 'VN',
                        limit: 1
                    },
                });

                console.log(response.data.features[0].properties.full_address);
                setSelectedLocation({
                    id: response.data.features[0].id,
                    full_address: response.data.features[0].properties.full_address,
                    center: response.data.features[0].geometry.coordinates,
                })
                setQuery(response.data.features[0].properties.full_address)
            }


        } catch (error) {
            console.error('Error fetching data from Mapbox:', error);
        }
    }

    const selectLocation = (location: Feature) => {
        setSelectedLocation(location);
        setResults([]);
        setQuery(location.full_address);
        searchStyle.value = withTiming({
            height: 40,
            width: (layout.width - 20) * 0.8,
            margintop: 10,
            borrderRadius: 20
        }, { duration: 500 })
    };

    const updateAddress = async () => {
        try {
            if (selectedLocation) {
                await firestore()
                    .collection('users')
                    .doc(userData?.id)
                    .update({
                        location: new GeoPoint(selectedLocation.center[1], selectedLocation.center[0]),
                    })
                    .then(() => {
                        closeModal()
                    })
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        ReverseGeocoding()
    }, [isAddress])

    return (
        <Modal
            animationType={'slide'}
            visible={isAddress}
        >
            <View style={styles.map}>
                <TouchableOpacity style={styles.button_container} onPress={() => updateAddress()}>
                    <Text style={styles.text_button}>Select Address</Text>
                </TouchableOpacity>
                <Animated.View style={[styles.search_container, animatedStyle]}>
                    <TextInput
                        mode="outlined"
                        style={styles.input_search}
                        placeholder="Search for an address"
                        value={query}
                        onChangeText={searchAddress}
                        onPress={() => {
                            searchAnimation()
                            searchAddress(query)
                        }}
                    />
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.item} onPress={() => selectLocation(item)}>
                                <Text>{item.full_address}</Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </Animated.View>
                <Mapbox.MapView style={styles.map_box} >
                    <Mapbox.Camera
                        zoomLevel={12}
                        // followUserLocation
                        centerCoordinate={selectedLocation ? selectedLocation.center : [0, 0]}
                    />
                    <LocationPuck puckBearingEnabled puckBearing='heading' />
                    {selectedLocation && (
                        <Mapbox.ShapeSource id="selectedLocation" shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: selectedLocation.center
                            },
                            properties: {}
                        }}>
                            <Mapbox.SymbolLayer
                                id="selectedLocationSymbol"
                                style={{ iconImage: 'avatar', iconSize: 0.25, iconAnchor: 'bottom', iconAllowOverlap: true, }}
                            />
                            <Mapbox.Images images={{ avatar: { uri: userData?.avatar } }}>

                            </Mapbox.Images>
                        </Mapbox.ShapeSource>
                    )}
                </Mapbox.MapView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        position: 'relative',
        alignItems: 'center',
    },
    map_box: {
        height: '100%',
        width: '100%'
    },
    input_search: {
        height: 40,
        width: '100%',
        backgroundColor: 'white',
    },
    search_container: {
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'white',
        width: '100%'

    },
    button_container: {
        position: 'absolute',
        zIndex: 1,
        height: layout.height * 0.06,
        width: layout.width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.blue_chat,
        bottom: 10,
        borderRadius: 20,
    },
    text_button: {
        fontWeight: '700',
        fontSize: 20,
        color: 'white'
    }
})