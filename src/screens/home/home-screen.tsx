import { ActivityIndicator, StyleSheet, Image, TouchableOpacity, View } from "react-native"

import { useEffect, useState } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import Mapbox, { Images, LocationPuck, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { StackNavigationProp } from "@react-navigation/stack";
import { TaskInfo } from "./task-info";
import { checkMessage, fetchApplication, fetchEmployee, fetchUserLocations } from "./home-helper";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/user/userSlice";
import { iUser } from "../../../types/userType";
import Icon from "react-native-vector-icons/FontAwesome";
import { color } from "../../constants/colors/color";
import { EmployeeListHome } from "./employee-list";
import { useTask } from "../../context/EmployeeContext";
import { Applications } from "../../../types/applications.type";
import { Task } from "../../../types/taskType";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";






type HomeScreenRouteProp = StackNavigationProp<RootStackParamList>;
Mapbox.setAccessToken('sk.eyJ1Ijoic29uaGFuMTQiLCJhIjoiY2x4dHI1N2Y1MDh3cDJxc2NteTBibjJkaSJ9.prG3DQ46R1SMRD80ztH3Mg');

export const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenRouteProp>()
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [taskGeoJsonData, setTaskGeoJsonData] = useState<any>(null);
    const [employeeList, setEmployeeList] = useState<iUser[]>()
    const [currentTask, setCurrentTask] = useState<Task>()
    const [applicationList, setApplicationList] = useState<Applications[]>()
    const userData = useSelector(selectUserData);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true)
    const client = useStreamVideoClient();
    const [isEmployee, setIsEmployee] = useState<boolean>(false)

    useEffect(() => {
        if (!userData) return;

        const unsubscribe = fetchUserLocations(userData.id, setGeoJsonData, setTaskGeoJsonData);
        const unsubscribeEmployee = fetchEmployee(setEmployeeList)

        return () => {
            unsubscribeEmployee();
            unsubscribe()
        }
    }, [userData]);
    useEffect(() => {
        if (userData) {
            checkMessage(navigation, setLoading, client, userData)
        }
    }, [userData])

    useEffect(() => {
        if (!isFocused) {
            setIsTask(0)
        }
    }, [isFocused]);
    const { isTask, setIsTask } = useTask();


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
            const item: Task = features[0].properties;
            fetchApplication(item?.id, setApplicationList)
            setCurrentTask(item)
            setIsTask(1)
        }
    }

    const handleCloseModal = () => {
        setIsTask(0)
    }

    const handleCloseEmployeeModal = () => {
        setIsEmployee(false)
    }


    if (!loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.search_container} onPress={() => setIsEmployee(true)}>
                    <Image source={images.search_icon} style={styles.search_icon} />
                </TouchableOpacity>
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
                                }}
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
            <TaskInfo isOpen={isTask} setClose={handleCloseModal} item={currentTask} applicationList={applicationList} />
            {employeeList && (
                <EmployeeListHome isEmployee={isEmployee} employeeList={employeeList} naigation={navigation} handleCloseEmployeeModal={handleCloseEmployeeModal} />
            )}
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

    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    search_container: {
        position: 'absolute',
        height: 50,
        width: 50,
        backgroundColor: 'white',
        zIndex: 2,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        right: 5,
        top: 5
    },
    search_icon: {
        height: 25,
        width: 25,
    }
})