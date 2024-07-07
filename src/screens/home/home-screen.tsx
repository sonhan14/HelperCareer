import { FlatList, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { useEffect, useState } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Mapbox, { Image, Images, LocationPuck, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { getDistance, getPreciseDistance } from 'geolib';
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { TaskInfo } from "./task-info";
import { fetchApplication, fetchUserLocations } from "./home-helper";
import { TaskType } from "../../../types/taskType";
import { formatDate } from "../../constants/formatDate";



type HomeScreenRouteProp = StackNavigationProp<RootStackParamList>;
Mapbox.setAccessToken('sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg');

export const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenRouteProp>()
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [taskGeoJsonData, setTaskGeoJsonData] = useState<any>(null);
    const [query, setQuery] = useState<string>('');
    const [isModal, setIsModal] = useState<boolean>(false);
    const currentUser = auth().currentUser
    const [currentTask, setCurrentTask] = useState<TaskType>()
    const [applicationList, setApplicationList] = useState<any>(null)
    

    useEffect(() => {
        if (!currentUser?.uid) return;

        const unsubscribe = fetchUserLocations(currentUser, setGeoJsonData, setTaskGeoJsonData);
        
        return () => unsubscribe();
    }, [currentUser]);


    const handleOpenEmployee = (event: any): void => {
        const features = event.features;
        if (features.length > 0) {
            const userId = features[0].properties.userId;

            navigation.navigate('EmployeeProfile', { employeeId: userId })
        }
    };

    const handleOpenTask = (event: any): void => {
        const features = event.features;
        if (features.length > 0) {
            const item: TaskType = features[0].properties;
            fetchApplication(item?.id, setApplicationList)
            setCurrentTask(item)
            setIsModal(true)
        }
        
    }

    const handleCloseModal = () => {
        setIsModal(false)
    }


    if (!currentUser) {
        navigation.replace('Login')
    }
    else {
        return (
            <View style={styles.page}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search for an address"
                        value={query}
                        onChangeText={() => { }}
                    />

                    <Mapbox.MapView style={styles.map} >
                        <Mapbox.Camera
                            followZoomLevel={11}
                            followUserLocation
                        />
                        <LocationPuck puckBearingEnabled puckBearing='heading' />
                        {geoJsonData && (
                            <ShapeSource id="employee_locations" shape={geoJsonData} onPress={handleOpenEmployee}>

                                <SymbolLayer
                                    id="employee_locations"
                                    style={{
                                        iconImage: 'avatar',
                                        iconSize: 0.6,
                                        iconAnchor: 'bottom-left',
                                        iconAllowOverlap: true,
                                        // textField: ['get', 'title'],
                                        // textSize: 12,
                                        // textAnchor: 'top',
                                        // textOffset: [0, -1.5],
                                        // textColor: 'red'
                                    }} // Adjust iconSize as needed
                                />
                                <Mapbox.Images images={{ avatar: images.avartar_pic }}>

                                </Mapbox.Images>
                            </ShapeSource>
                        )}
                        {taskGeoJsonData && (
                            <ShapeSource id="task_locations" shape={taskGeoJsonData} onPress={handleOpenTask}>
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
                <TaskInfo isOpen={isModal} setClose={handleCloseModal} item={currentTask} applicationList={applicationList}/>
            </View>
        )
    }

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