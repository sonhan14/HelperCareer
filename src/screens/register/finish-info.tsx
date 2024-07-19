import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Animated, { interpolate, LightSpeedInRight, LightSpeedOutRight, RollInRight, StretchInX, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { layout } from "../../constants/dimensions/dimension"
import FastImage from "react-native-fast-image"
import { images } from "../../images"
import { color } from "../../constants/colors/color"
import { accountInfo } from "./register-modal"
import Mapbox, { LocationPuck, PointAnnotation } from "@rnmapbox/maps"
import { Feature } from "../../../types/homeTypes"
import { useEffect, useState } from "react"
import axios from "axios"
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { CustomButton } from "../../components/custom-button"

interface FinishInfoProps {
    account: accountInfo,
    setAccount: React.Dispatch<React.SetStateAction<accountInfo>>,
    isRegister: boolean, isValid: string,
    selectedLocation: Feature,
    setSelectedLocation: React.Dispatch<React.SetStateAction<Feature>>,
    handleAddInfo: () => void,
    loading: boolean
}

export const FinishInfo = ({ account, setAccount, isRegister, isValid, selectedLocation, setSelectedLocation, handleAddInfo, loading }: FinishInfoProps) => {
    const [results, setResults] = useState<Feature[]>([]);
    const [query, setQuery] = useState<string>('');
    const animatedValue = useSharedValue(40)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: animatedValue.value,
            width: (layout.width - 20) * 0.8,
            marginTop: 10,
            borderRadius: interpolate(
                animatedValue.value,
                [40, layout.height * 0.15],
                [20, 0]
            )
        }
    })



    const searchLocation = () => {
        animatedValue.value = withTiming(layout.height * 0.15, { duration: 1000 })
    }

    const selectLocation = (location: Feature) => {
        setSelectedLocation(location);
        setResults([]);
        setQuery(location.full_address);
        animatedValue.value = withTiming(40, { duration: 500 })

    };

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



    return (
        <KeyboardAwareFlatList scrollEnabled={false}
            data={[{ key: 'main' }]}
            keyExtractor={(item) => item.key}
            renderItem={() => (
                <Animated.View style={styles.container} entering={StretchInX.duration(1000)}>
                    <View style={styles.login_image_container}>
                        <Text style={styles.text_title}>Complete your profile</Text>
                        <View style={styles.avatar_container}>
                            <FastImage source={images.map_animation} resizeMode="contain" style={styles.avatar} />
                        </View>
                    </View>
                    <Text style={styles.text_input_blue}>Address</Text>
                    <View style={styles.map}>
                        <Animated.View style={[styles.search_container, animatedStyle]}>
                            <TextInput
                                style={styles.input_search}
                                placeholder="Search for an address"
                                value={query}
                                onChangeText={searchAddress}
                                onPress={() => {
                                    searchAddress(query)
                                    searchLocation()
                                }}
                            />
                            <View >
                                <FlatList
                                    data={results}
                                    style={{ height: layout.height * 0.05 * 2 }}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.item} onPress={() => { selectLocation(item) }}>
                                            <Text>{item.full_address}</Text>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </Animated.View>
                        <Mapbox.MapView style={styles.map_box} >
                            <Mapbox.Camera
                                zoomLevel={12}
                                // followUserLocation
                                centerCoordinate={selectedLocation ? selectedLocation.center : [0, 0]}
                            />
                            <LocationPuck puckBearingEnabled puckBearing='heading' />
                            {selectedLocation && (
                                <PointAnnotation
                                    id="avatar"
                                    coordinate={selectedLocation.center}
                                >
                                    <View style={styles.annotationContainer}>
                                        <View style={styles.annotationFill} />
                                    </View>
                                </PointAnnotation>
                            )}
                        </Mapbox.MapView>
                    </View>

                    <View style={styles.input_container}>
                        <Text style={styles.text_input_blue}>Phone Number</Text>
                        <TextInput
                            style={[styles.text_input]}
                            placeholder="0123456789"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={(text) => { setAccount(prev => ({ ...prev, phone: text })) }}
                            value={account.phone}
                            keyboardType='numeric'
                        />
                    </View>

                    {isValid ? (
                        <Animated.View
                            entering={LightSpeedInRight.duration(500)}
                            exiting={LightSpeedOutRight.duration(500)}
                        >
                            <Text style={styles.error_text}>{isValid}</Text>
                        </Animated.View>

                    ) : <Animated.View
                        entering={LightSpeedInRight.duration(500)}
                        exiting={LightSpeedOutRight.duration(500)}></Animated.View>
                    }

                    <View style={[styles.input_container, { height: layout.height * 0.2 }]}>
                        <Text style={styles.text_input_blue}>Introduction</Text>
                        <TextInput
                            style={[styles.text_input1, { height: layout.height * 0.15, textAlignVertical: 'top' }]}
                            placeholder="Hi, I'm William"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={(text) => { setAccount(prev => ({ ...prev, intro: text })) }}
                            value={account.intro}
                            numberOfLines={4}
                            multiline={true}
                        />
                    </View>
                    <CustomButton
                        title="Finish"
                        onPress={handleAddInfo}
                        style={styles.signin_button}
                        disabled={isRegister || isValid !== ''}
                        disabledStyle={styles.signin_button_disable}
                        loading={loading}
                    />
                </Animated.View>
            )}
        />


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    login_image_container: {
        width: layout.width - 40,
        height: layout.height * 0.2,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 15,
    },
    text_title: {
        color: color.link_text,
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center'
    },
    avatar_container: {
        height: layout.height * 0.15,
        width: layout.width
    },
    avatar: {
        height: layout.height * 0.15,
        width: layout.width
    },
    input_container: {
        width: '100%',
        height: layout.height * 0.1,
        marginBottom: 25,
        justifyContent: 'space-between',
    },
    text_input_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
        width: '30%'
    },
    text_input: {
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
        shadowRadius: 10
    },
    text_input1: {
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        shadowRadius: 10,
        shadowOffset: { height: 100, width: 0 }
    },
    signin_button_disable: {
        backgroundColor: color.button_color,
        width: layout.width - 40,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: layout.width - 40,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    text_button: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    error_text: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10
    },
    map: {
        height: layout.height * 0.22,
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 10,
        marginTop: 5
    },
    search_container: {
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20
    },
    input_search: {
        height: 40,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 10
    },
    item: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        height: layout.height * 0.05

    },
    map_box: {
        height: layout.height * 0.22,
        width: layout.width - 40,
        borderRadius: 50
    },
    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },
    annotationFill: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        transform: [{ scale: 0.6 }]
    }
})