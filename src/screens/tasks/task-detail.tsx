import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { images } from "../../images"
import { formatDate } from "../../constants/formatDate"
import { RootStackParamList } from "../../navigations/navigation"
import { layout } from "../../constants/dimensions/dimension"
import { useEffect, useState } from "react"
import { Task } from "../../../types/taskType"
import { fetchTaskDetail, handleDeleteTask, handleFinishTask } from "./task-helper"
import { color } from "../../constants/colors/color"
import { fetchApplication } from "../home/home-helper"
import { Appbar, Button, Dialog, PaperProvider, Portal } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { Applications } from "../../../types/applications.type"
import { handleChat } from "../employee-profile/employee-helper"
import auth from '@react-native-firebase/auth';
import { TaskModal } from "./task-modal"
import { selectUserData } from "../../redux/user/userSlice"
import { useSelector } from "react-redux"

type TaskDetailNavigatorProps = {
    route: { params: RootStackParamList['TaskDetail'] };
};

type TaskDetailNavigation = StackNavigationProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetail = ({ route }: TaskDetailNavigatorProps) => {
    const item = route.params.TaskId;
    const [taskDetail, setTaskDetail] = useState<Task | null>(null);
    const [applicationList, setApplicationList] = useState<Applications[]>()
    const navigation = useNavigation<TaskDetailNavigation>();
    const handleBack = () => {
        navigation.goBack()
    }
    const userData = useSelector(selectUserData);
    const [isModal, setIsModal] = useState<boolean>(false)
    const closeModal = () => {
        setIsModal(false)
    }
    const openModal = () => {
        setIsModal(true)
    }
    const [visible, setVisible] = useState(false);
    const [actionType, setActionType] = useState<'finish' | 'delete' | null>(null);

    const hideDialog = () => {
        setVisible(false);
    };

    const handleAction = (actionType: 'finish' | 'delete') => {
        setActionType(actionType);
        setVisible(true);
    };

    const handleDialogYes = () => {
        if (actionType) {
            if (actionType === 'finish') {
                handleFinishTask(handleBack, item)
            } else if (actionType === 'delete') {
                handleDeleteTask(item, handleBack)
            }
            setVisible(false);
            setActionType(null);
        }
    };

    useEffect(() => {
        if (!item) return;
        const unsubscribe = fetchTaskDetail(item, setTaskDetail)
        const applicationUnsubscribe = fetchApplication(item, setApplicationList)
        return () => {
            applicationUnsubscribe();
            unsubscribe();
        }
    }, [item])


    const renderItem = ({ item }: { item: Applications }) => {
        return (
            <TouchableOpacity style={styles.employee_container} onPress={() => { handleChat(item.user_id, userData?.id, navigation, item.last_name + ' ' + item.first_name, item.fcmToken) }}>
                <View style={styles.image_container}>
                    <Image source={{ uri: item.avatar }} resizeMode='contain' style={{ height: '100%', width: '100%', borderRadius: 100 }} />
                </View>
                <View style={styles.name_container}>
                    <Text style={styles.text_title}>Name: {item.last_name} {item.first_name}</Text>
                    <Text style={styles.text_Date}>Rating: {item.rating}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <PaperProvider>

            <View style={styles.main_container}>
                <Appbar.Header style={styles.header_container}>
                    <Appbar.BackAction onPress={() => { handleBack() }} />
                    <Appbar.Content title={'Task Detail'} titleStyle={{ color: 'black', fontWeight: '700' }} />
                    <Appbar.Action icon="file-edit-outline" onPress={() => { openModal() }} size={30} />
                </Appbar.Header>
                <View style={styles.task_name_container}>
                    <View style={styles.image_container}>
                        <Image source={images.task_image} resizeMode='contain' style={{ height: '100%', width: '100%' }} />
                    </View>
                    <View style={styles.name_container}>
                        <Text style={styles.text_title}>Task Name: {taskDetail?.task_name}</Text>
                        {
                            taskDetail?.start_date && taskDetail.end_date ?
                                <Text style={styles.text_Date}>Duration: {taskDetail.start_date} - {taskDetail.end_date}</Text>
                                :
                                null
                        }
                    </View>
                </View>

                <View style={styles.des_container}>
                    <View style={styles.des_box}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                            <Text style={styles.text_15}>{taskDetail?.task_description}</Text>
                        </ScrollView>
                    </View>
                </View>

                <Text style={[styles.text_title, { marginLeft: 10 }]}>Active Employees</Text>
                <View style={styles.application_container}>
                    {applicationList && applicationList.filter(app => app.status === 'accepted').length !== 0 ?
                        <FlatList
                            data={applicationList.filter(app => app.status === 'accepted')}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={(renderItem)}
                        />
                        :
                        <View>
                            <Image source={images.list_empty} />
                        </View>
                    }

                </View>

                <View style={styles.bottom_handle}>
                    <TouchableOpacity style={styles.delete_button} onPress={() => { handleAction('delete') }}>
                        <Text style={styles.text_delete}>Delete Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.done_button} onPress={() => { handleAction('finish') }}>
                        <Text style={styles.text_finish}>Finish Task</Text>
                    </TouchableOpacity>
                </View>

                {isModal ? <TaskModal isModal={isModal} closeModal={() => closeModal()} item={taskDetail} /> : null}
            </View>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to {actionType === 'finish' ? 'finish' : 'delete'} this Task?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>NO</Button>
                        <Button onPress={handleDialogYes}>YES</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'white'
    },
    header_container: {
        height: layout.height * 0.06,
        width: layout.width,
        backgroundColor: 'white'
    },
    employee_container: {
        height: layout.height * 0.1,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        marginBottom: 15,
        alignItems: 'center'
    },
    task_name_container: {
        height: layout.height * 0.1,
        width: layout.width,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    image_container: {
        height: layout.height * 0.1,
        width: layout.height * 0.1,
        marginRight: 5,
        padding: 5
    },
    name_container: {
        height: '100%',
        justifyContent: 'center'
    },
    text_title: {
        fontWeight: '700',
        fontSize: 20,
        color: 'black'
    },
    des_container: {
        height: layout.height * 0.3,
        width: layout.width,
        marginTop: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'white',

    },
    des_box: {
        padding: 10,
        height: '100%',
        width: '100%',
        borderWidth: 1,
        borderRadius: 20
    },
    text_15: {
        color: 'black',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'justify'
    },
    text_Date: {
        color: 'green',
        fontSize: 15
    },
    bottom_handle: {
        zIndex: 1,
        position: 'absolute',
        bottom: 0,
        width: layout.width,
        height: layout.height * 0.08,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 24,
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'space-between'
    },
    delete_button: {
        height: '100%',
        width: '45%',
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    done_button: {
        height: '100%',
        width: '45%',
        backgroundColor: color.blue_chat,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_delete: {
        fontSize: 18,
        fontWeight: '700',
        color: 'red'
    },
    text_finish: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white'
    },
    application_container: {
        height: (layout.height * 0.1 + 20) * 3,
        width: layout.width,
        padding: 10
    }
})