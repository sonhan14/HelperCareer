import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import Icon from "react-native-vector-icons/AntDesign"
import { color } from "../../constants/colors/color"
import { Searchbar } from "react-native-paper"
import React, { useEffect, useRef, useState } from "react"
import { Circle, G, Svg } from "react-native-svg"
import { TaskItem } from "./task-item"
import { TaskModal } from "./task-modal"
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Task, TaskType } from "../../../types/taskType"
import { fetchTasks } from "./task-helper"
import { useSelector } from "react-redux"
import { selectUserData } from "../../redux/user/userSlice"

const AnimatedCicle = Animated.createAnimatedComponent(Circle)
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);



export const TaskScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);
    const [isFocused, setIsFocused] = useState(false);
    const searchbarRef = useRef<React.ElementRef<typeof Searchbar>>(null);
    const userData = useSelector(selectUserData);

    const radius = 45;
    const circumference = radius * Math.PI * 2;
    const circleRef = useRef<React.ElementRef<typeof Circle>>(null)
    const inputRef = useRef<React.ElementRef<typeof TextInput>>(null)

    const [isModal, setIsModal] = useState<boolean>(false)

    const [tasksList, setTasksList] = useState<TaskType[]>([]);
    const [taskDone, setTaskDone] = useState<TaskType[]>([]);

    const [taskPercent, setTaskPercent] = useState({
        tasks: 1,
        tasksDone: 1
    })

    const progress = useRef(new Animated.Value(0)).current;
    const animation = (toValue: number) => {
        return Animated.timing(progress, {
            toValue,
            duration: 2000,
            delay: 0,
            useNativeDriver: true
        }).start()
    }



    useEffect(() => {
        if (!userData) return;

        const unsubscribe = fetchTasks(userData.id, setTasksList, setTaskPercent, setTaskDone);
        console.log(taskDone.length);

        return () => unsubscribe();
    }, [userData]);


    const onFocus = () => setIsFocused(true);
    const onBlur = () => {
        searchbarRef.current?.blur();
        setIsFocused(false)
    };

    useEffect(() => {
        animation(taskPercent.tasksDone)
        progress.addListener((v: any) => {
            const maxPercent = 100 * v.value / taskPercent.tasks
            const strokeDashoffset = circumference - (circumference * maxPercent) / 100
            if (circleRef.current) {

                circleRef.current.setNativeProps({
                    strokeDashoffset
                })
            }

            if (inputRef.current) {
                inputRef.current.setNativeProps({
                    text: Math.round(maxPercent) + '%'
                })

            }
        })

        return () => {
            progress.removeAllListeners();
        }


    }, [taskPercent])

    const openModal = () => {
        setIsModal(true)
    }

    const closeModal = () => {
        setIsModal(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.main_container}>
                <View style={styles.header_container}>
                    <Text style={styles.text_header}>Manage Tasks</Text>
                    <TouchableOpacity onPress={() => openModal()}>
                        <Icon name="pluscircleo" size={30} color={'black'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchbar_container}>
                    <Searchbar
                        onClearIconPress={() => {
                            onBlur()
                        }}
                        ref={searchbarRef}
                        iconColor={'black'}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        placeholder={isFocused ? '' : "Browse your name task..."}
                        style={styles.search_bar}
                        placeholderTextColor={'black'}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </View>

                <View style={styles.tasks_review_container}>
                    <View style={styles.info_container}>
                        <Text style={[styles.text_header, { color: 'white' }]}>Tasks Done</Text>
                        <Text style={styles.text_white_16}>{taskPercent.tasksDone}/{taskPercent.tasks}</Text>
                        <TouchableOpacity style={styles.review_button}>
                            <Text style={styles.text_black_16}>Review</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.percent_container}>
                        <Svg height={90} width={90} viewBox="0 0 110 110">
                            <View style={styles.percent_number_container}>
                                <AnimatedTextInput
                                    ref={inputRef}
                                    editable={false}
                                    defaultValue="0"
                                    style={[
                                        styles.percent_number
                                    ]}
                                />
                            </View>
                            <G rotation='-90' origin={'55, 55'}>
                                <Circle
                                    cx={55}
                                    cy={55}
                                    r={45}
                                    stroke={'white'}
                                    strokeWidth={10}
                                    fill={'transparent'}
                                    strokeOpacity={0.2}
                                />
                                <AnimatedCicle
                                    ref={circleRef}
                                    cx={55}
                                    cy={55}
                                    r={45}
                                    stroke={'white'}
                                    strokeWidth={10}
                                    fill={'transparent'}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference}
                                    strokeLinecap="round"
                                />
                            </G>
                        </Svg>
                    </View>
                </View>
                <View style={styles.list_container}>
                    <FlatList
                        // style={{ backgroundColor: color.light_background }}
                        data={tasksList}
                        renderItem={({ item }) => <TaskItem item={item} />}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            {isModal ? <TaskModal isModal={isModal} closeModal={() => closeModal()} item={null} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 5
    },
    main_container: {
        flex: 1,
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: color.light_background,
        paddingHorizontal: 15

    },
    header_container: {
        height: layout.height * 0.05,
        width: layout.width - 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    text_header: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black'
    },
    searchbar_container: {
        height: layout.height * 0.1,
        width: '100%',
        marginTop: 10,
    },
    search_bar: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    tasks_review_container: {
        height: layout.height * 0.15,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#8667F2',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20

    },
    info_container: {
        height: '100%',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    percent_container: {
        height: '100%',
        width: '50%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    text_white_16: {
        color: 'white',
        fontSize: 16
    },
    text_black_16: {
        color: 'black',
        fontSize: 16
    },
    review_button: {
        height: '30%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    percent_number_container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    percent_number: {
        fontSize: 45 / 2,
        color: 'white' ?? 'black',
        fontWeight: '900',
        textAlign: 'center',
        position: 'absolute'
    },
    list_container: {
        width: layout.width,
        height: (layout.height * 0.15 + 15) * 3,
        alignItems: 'center'
    }
});
