import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Appbar, TextInput } from "react-native-paper"
import { layout } from "../../constants/dimensions/dimension"
import { useEffect, useState } from "react"
import auth from '@react-native-firebase/auth';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CustomButton } from "../../components/custom-button";
import { color } from "../../constants/colors/color";
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import axios from 'axios';
import Mapbox, { LocationPuck } from "@rnmapbox/maps";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Marker } from "react-native-maps";
import { images } from "../../images";
import { KeyboardAvoidingView } from "react-native";
import { Task, TaskType } from "../../../types/taskType";
import { AddNew } from "./task-helper";
import { selectUserData } from "../../redux/user/userSlice";
import { useSelector } from "react-redux";




interface Feature {
    id: string;
    full_address: string;
    center: [number, number];
}



export const TaskModal = ({ isModal, closeModal, item }: { isModal: boolean, closeModal: () => void, item: TaskType | null }) => {
    const userData = useSelector(selectUserData);
    const [loading, setLoading] = useState<boolean>(false)
    const [showDatePicker, setShowDatePicker] = useState({
        showStartDate: false,
        showEndDate: false
    });


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

    const initialTaskData: Task = {
        task_name: '',
        task_description: '',
        user_id: userData?.id,
        location: new GeoPoint(0, 0),
        status: 'process',
        start_date: new Date(),
        end_date: new Date(),

    };

    const [taskItem, setTaskItem] = useState<Task>(item === null ? initialTaskData : {
        task_name: item.task_name,
        task_description: item.task_des,
        user_id: userData?.id,
        location: new GeoPoint(item.latitude, item.longitude),
        status: item.status,
        start_date: new Date(item.start_date),
        end_date: new Date(item.end_date),
    })
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Feature[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Feature>();

    const isAddNew = !taskItem.task_name || !taskItem.task_description || !query;

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
            const response = await axios.get('https://api.mapbox.com/search/geocode/v6/reverse', {
                params: {
                    longitude: item?.longitude,
                    latitude: item?.latitude,
                    access_token: 'sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg',
                    proximity: '105.7827,21.0285', // Center point in Hanoi
                    bbox: '102.14441,8.17966,109.46464,23.393395', // Bounding box around Vietnam
                    language: 'vi',
                    country: 'VN',
                    limit: 1
                },
            });
            
            setSelectedLocation({
                id: response.data.features[0].id,
                full_address: response.data.features[0].properties.full_address,
                center: response.data.features[0].geometry.coordinates,
            })
            setQuery(response.data.features[0].properties.full_address)

        } catch (error) {
            console.error('Error fetching data from Mapbox:', error);
        }
    }

    const selectLocation = (location: Feature) => {
        setSelectedLocation(location);
        setResults([]);
        setQuery(location.full_address);
        console.log(location.center);


        searchStyle.value = withTiming({
            height: 40,
            width: (layout.width - 20) * 0.8,
            margintop: 10,
            borrderRadius: 20
        }, { duration: 500 })

    };

    const handleBack = () => {
        setQuery('')
        setTaskItem(initialTaskData)
        closeModal()
    }

    const handleLoading = () => {
        setLoading(!loading)
    }

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "dismissed") {
            // User dismissed the date picker
            setShowDatePicker({
                showStartDate: false,
                showEndDate: false
            });
            return;
        }
        const currentDate = selectedDate || taskItem.start_date;
        setShowDatePicker({
            showStartDate: false,
            showEndDate: false
        });

        if (showDatePicker.showStartDate) {
            setTaskItem(prevState => ({
                ...prevState,
                start_date: currentDate,
                end_date: currentDate > taskItem.end_date ? currentDate : taskItem.end_date
            }));
        } else if (showDatePicker.showEndDate) {
            setTaskItem(prevState => ({
                ...prevState,
                end_date: currentDate > taskItem.start_date ? currentDate : taskItem.start_date
            }));
        }
    };

    const searchAnimation = () => {
        searchStyle.value = withTiming({
            height: layout.height * 0.3,
            width: layout.width - 20,
            margintop: 0,
            borrderRadius: 0
        }, { duration: 500 })

    }
    useEffect(() => {
        if (item) {
            ReverseGeocoding()
        }
    }, [item])
    return (
        <Modal
            animationType={'slide'}
            visible={isModal}
        >
            <Appbar.Header style={styles.header_container}>
                <Appbar.BackAction onPress={() => { handleBack() }} />
                <Appbar.Content title={'Add new task'} titleStyle={{ color: 'black', fontWeight: '700' }} />
            </Appbar.Header>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={styles.main_container}>
                    <TextInput
                        mode="outlined"
                        label="Task Name"
                        value={taskItem.task_name}
                        onChangeText={(text) => { setTaskItem(prev => ({ ...prev, task_name: text })) }}
                        style={styles.input_container}
                    />
                    <TextInput
                        mode="outlined"
                        label="Task Description"
                        value={taskItem.task_description}
                        onChangeText={(text) => { setTaskItem(prev => ({ ...prev, task_description: text })) }}
                        style={[styles.input_container, { height: layout.height * 0.15 }]}
                        numberOfLines={4}
                        multiline={true}
                        scrollEnabled={true}
                        textAlign="center"
                    />

                    <TouchableOpacity onPress={() => setShowDatePicker(prev => ({ ...prev, showStartDate: true }))}>
                        <TextInput
                            mode="outlined"
                            label="Start Date"
                            value={taskItem.start_date.toLocaleDateString()}
                            style={styles.input_container}
                            editable={false}

                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowDatePicker(prev => ({ ...prev, showEndDate: true }))}>
                        <TextInput
                            mode="outlined"
                            label="End Date"
                            value={taskItem.end_date.toLocaleDateString()}
                            style={styles.input_container}
                            editable={false}
                        />
                    </TouchableOpacity>

                    <View style={styles.map}>
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
                                    <Mapbox.Images images={{ avatar: images.task_image }}>

                                    </Mapbox.Images>
                                </Mapbox.ShapeSource>
                            )}
                        </Mapbox.MapView>
                    </View>



                    {showDatePicker.showStartDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={taskItem.start_date}
                            mode="date" 
                            is24Hour={true}
                            display="default" 
                            onChange={onChangeDate}
                        />
                    )}

                    {showDatePicker.showEndDate && (
                        <DateTimePicker
                            testID="dateTimePickerEnd"
                            value={taskItem.end_date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                    {item === null ?
                    <CustomButton
                    title="Add New Task"
                    onPress={() => { AddNew(selectedLocation, taskItem, userData?.id, handleBack, null, handleLoading) }}
                    style={styles.add_button}
                    disabled={isAddNew}
                    disabledStyle={styles.add_button_disable}
                    loading={loading}
                />
                :
                <CustomButton
                        title="Edit This Task"
                        onPress={() => { AddNew(selectedLocation, taskItem, userData?.id, handleBack, item.id, handleLoading) }}
                        style={styles.add_button}
                        disabled={isAddNew}
                        disabledStyle={styles.add_button_disable}
                        loading={loading}
                    />
                    }
                </View>
            </KeyboardAvoidingView>

        </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header_container: {
        height: layout.height * 0.06,
        width: layout.width,
        backgroundColor: 'white'
    },
    main_container: {
        flex: 1,
        padding: 10,
        width: layout.width
    },
    input_container: {
        marginBottom: 20,
        textAlign: 'justify',
        width: layout.width - 20
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
    add_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '10%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    add_button_disable: {
        backgroundColor: color.button_color,
        width: '100%',
        height: '10%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'white',
        width: '100%'

    },
    map: {
        height: layout.height * 0.3,
        width: '100%',
        position: 'relative',
        alignItems: 'center',
    },
    map_box: {
        height: '100%',
        width: '100%'
    }
})