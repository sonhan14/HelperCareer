import Animated, { FadeIn, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { layout } from "../../constants/dimensions/dimension";
import { useEffect, useRef, useState } from "react";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TaskType } from "../../../types/taskType";
import { images } from "../../images";
import { formatDate } from "../../constants/formatDate";
import SweepButton from "../../components/sweep-button";
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchApplication, hanleAccepted, hanleRejected } from "./home-helper";
import { EmployeeList } from "./application-item";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { Applications } from "../../../types/applications.type";

interface imodal {
    isOpen: boolean,
    setClose: () => void,
    item?: TaskType,
    applicationList: Applications[]
}





export const TaskInfo = ({ isOpen, setClose, item, applicationList }: imodal) => {
    const dragY = useSharedValue(layout.height / 2);
    const latsY = useSharedValue(0);
    const threshold = 0
    const isDragging = useSharedValue(true);
    const [showEmployee, setShowEmployee] = useState(false)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: dragY.value },
            ],
        };
    });
    const [visible, setVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Applications | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

    const hideDialog = () => {
        setVisible(false);
        setSelectedApplication(null);
        setActionType(null);
    };

    const handleAction = (application: Applications, actionType: 'accept' | 'reject') => {
        setSelectedApplication(application);
        setActionType(actionType);
        setVisible(true);
    };


    const handleDialogYes = () => {
        if (selectedApplication && actionType) {
            if (actionType === 'accept') {
                // Handle accept action
                hanleAccepted(selectedApplication);
            } else if (actionType === 'reject') {
                // Handle reject action
                hanleRejected(selectedApplication);
            }
            setVisible(false);
            setSelectedApplication(null);
            setActionType(null);
        }
    };

    const IconAnimated = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: withTiming(showEmployee ? '90deg' : '0deg', { duration: 300 })
                }
            ]
        };
    });


    useEffect(() => {
        if (isOpen) {
            dragY.value = withTiming(0, { duration: 500 });
        }
        else {
            dragY.value = withTiming(layout.height, { duration: 500 })
        }
    }, [isOpen, dragY]);

    const gestureHandle = Gesture.Pan()
        .onStart((e) => {
            if (e.y <= layout.height * 0.055) {
                isDragging.value = true;
                latsY.value = dragY.value;
            } else {
                isDragging.value = false;
            }
        })
        .onUpdate((e) => {
            if (isDragging.value) {
                dragY.value = e.translationY + latsY.value;
                dragY.value = Math.max(dragY.value, -layout.height * 0.6);
            }
        })
        .onEnd((e) => {
            if (isDragging.value) {
                if (dragY.value <= threshold - 150) {
                    latsY.value = -layout.height * 0.6;
                }
                else if (dragY.value > threshold - 150 && dragY.value <= threshold + 150) {
                    latsY.value = 0;
                }
                else {
                    runOnJS(setShowEmployee)(false)
                    runOnJS(setClose)();
                }
                dragY.value = withTiming(latsY.value, { duration: 500 });
            }
        })

    const pressEmployee = () => {
        if (!showEmployee) {

            setShowEmployee(true)
        }
        else {
            setShowEmployee(false)
        }
    }

    return (

        <GestureDetector gesture={gestureHandle}>
            <Animated.View style={[styles.modal_info_container, animatedStyle]}>
                <Provider>
                    <View>
                        <View style={styles.swipe_bar_container}>
                            <View style={styles.swipe_bar}></View>
                        </View>

                        <View style={styles.main_container}>
                            <View style={styles.task_name_container}>
                                <View style={styles.image_container}>
                                    <Image source={images.task_image} resizeMode='cover' style={{ height: '100%', width: '100%' }} />
                                </View>
                                <View style={styles.name_container}>
                                    <Text style={styles.text_title}>Task Name: {item?.task_name}</Text>
                                    {
                                        item?.start_date && item.end_date ?
                                            <Text style={styles.text_Date}>Duration: {formatDate(new Date(item.start_date))} - {formatDate(new Date(item.end_date))}</Text>
                                            :
                                            null
                                    }
                                </View>
                            </View>

                            <View style={styles.des_container}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.text_15}>{item?.task_des}</Text>
                                </ScrollView>
                            </View>

                            <TouchableOpacity style={styles.manage_container} onPress={() => { pressEmployee() }}>
                                <View style={styles.manage_title}>
                                    <Icon name={'tasks'} size={20} color={'black'} style={{ marginRight: 10 }} />
                                    <Text style={styles.text_15}>Manage Employee</Text>
                                </View>
                                <Animated.View style={[IconAnimated]}>
                                    <Icon name="angle-right" size={30} color={'black'} />
                                </Animated.View>
                            </TouchableOpacity>
                            <EmployeeList showEmployee={showEmployee} employeeList={applicationList} handleAction={handleAction} />
                        </View>
                    </View>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>Notification</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to {actionType === 'accept' ? 'accept' : 'reject'} this application?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>NO</Button>
                                <Button onPress={handleDialogYes}>YES</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Provider>
            </Animated.View>
        </GestureDetector>

    )
}

const styles = StyleSheet.create({
    modal_info_container: {
        height: layout.height,
        width: layout.width,
        position: 'absolute',
        top: layout.height * 0.6,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        zIndex: 1
    },
    swipe_bar_container: {
        width: layout.width,
        height: layout.height * 0.055,
        justifyContent: 'center',
        alignItems: 'center'
    },
    swipe_bar: {
        height: layout.height * 0.01,
        width: layout.width * 0.15,
        backgroundColor: 'rgba(160, 70, 70, 1)',
        borderRadius: 10
    },
    text_title: {
        fontWeight: '700',
        fontSize: 20,
        color: 'black'
    },
    main_container: {
        padding: 10,
        flex: 1
    },
    task_name_container: {
        height: layout.height * 0.1,
        width: layout.width - 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image_container: {
        height: '100%',
        width: layout.height * 0.1,
        marginRight: 5
    },
    text_Date: {
        color: 'green',
        fontSize: 15
    },
    name_container: {
        height: '100%',
        justifyContent: 'center'
    },
    des_container: {
        height: layout.height * 0.3,
        width: layout.width - 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 10,
        padding: 10,
        marginBottom: 20
    },
    text_15: {
        color: 'black',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'justify'
    },
    manage_container: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 0.08
    },
    manage_title: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%'
    },


})