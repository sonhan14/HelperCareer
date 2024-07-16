import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import { layout } from "../../constants/dimensions/dimension";
import { color } from "../../constants/colors/color";
import { iUser } from "../../../types/userType";
import { FlatList } from "react-native-gesture-handler";
import { images } from "../../images";
import { formatDate } from "../../constants/formatDate";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigations/navigation";
type HomeScreenRouteProp = StackNavigationProp<RootStackParamList>;

interface EmployeeListHomeProps {
    isEmployee: number,
    animationHandle: () => void,
    employeeList: iUser[],
    naigation: HomeScreenRouteProp
}

const EmployeeItem = ({ item, naigation }: { item: iUser, naigation: HomeScreenRouteProp }) => {
    if (!item) {
        return
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header_container} onPress={() => naigation.navigate('EmployeeProfile', { employeeId: item.id })}>
                <Image source={item.avatar === undefined ? images.avartar_pic : { uri: item.avatar }} resizeMode='contain' style={styles.image_style} />
                <View style={styles.task_info_container}>
                    <Text style={styles.text_black_20}>{item.last_name} {item.first_name}</Text>
                    <Text style={styles.text_black_15}>{item.birthday}</Text>
                    <Text style={styles.text_black_15}>Gender: {item.gender}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const EmployeeListHome = ({ isEmployee, animationHandle, employeeList, naigation }: EmployeeListHomeProps) => {
    const height = useSharedValue(0);
    const [query, setQuery] = useState<string>('');
    const [filteredEmployeeList, setFilteredEmployeeList] = useState<iUser[]>(employeeList);

    useEffect(() => {
        setFilteredEmployeeList(employeeList);
    }, [employeeList]);

    useEffect(() => {
        if (isEmployee === 0) {
            setQuery('')
            setFilteredEmployeeList(employeeList)
        }
    }, [isEmployee]);

    const handleSearch = (text: string) => {
        setQuery(text);
        const filteredList = employeeList.filter(employee =>
            `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredEmployeeList(filteredList);
    };

    const searchAnimation = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            height.value,
            [40, layout.height * 0.6, layout.height],
            [20, 10, 0]
        );

        const width = interpolate(
            height.value,
            [40, layout.height * 0.6, layout.height],
            [40, layout.width * 0.5, layout.width]
        );

        const bgColor = interpolateColor(
            height.value,
            [40, layout.height * 0.5, layout.height],
            ['#478CCF', '#36C2CE', color.light_background]
        );

        return {
            height: height.value,
            width,
            borderRadius,
            backgroundColor: bgColor,
        };
    });

    const inputAnimation = useAnimatedStyle(() => {
        const opacity = interpolate(
            height.value,
            [40, layout.height * 0.9, layout.height],
            [0, 0.2, 1]
        );
        const translateX = interpolate(
            height.value,
            [40, layout.height],
            [-layout.width, 0]
        );

        const width = interpolate(
            height.value,
            [40, layout.height * 0.6, layout.height],
            [40, layout.width * 0.5, layout.width]
        );
        return {
            opacity,
            transform: [{ translateX }],
            width
        };
    });

    const employeeAnimation = useAnimatedStyle(() => {
        const opacity = interpolate(
            height.value,
            [40, layout.height * 0.9, layout.height],
            [0, 0.2, 1]
        );
        const translateX = interpolate(
            height.value,
            [40, layout.height],
            [-layout.width, 0]
        );

        const width = interpolate(
            height.value,
            [40, layout.height * 0.6, layout.height],
            [40, layout.width * 0.5, layout.width]
        );

        const listHeight = interpolate(
            height.value,
            [40, layout.height * 0.6, layout.height],
            [0, layout.height * 0.12, employeeList.length < 3 ? (layout.height * 0.12 + 20) * employeeList.length : (layout.height * 0.12 + 20) * 3]
        );

        return {
            opacity,
            transform: [{ translateX }],
            width,
            height: listHeight
        };
    });

    useEffect(() => {
        height.value = withTiming(isEmployee === 0 ? 40 : layout.height, { duration: 2000 });
    }, [isEmployee]);

    return (
        <Animated.View style={[styles.employee_container, searchAnimation]}>
            <TouchableOpacity onPress={animationHandle} style={styles.search_button}>
                {isEmployee === 0 ?
                    <Icon name="search" color={'black'} size={25} />
                    :
                    <Icon name="remove" color={'black'} size={25} />
                }
            </TouchableOpacity>
            <Animated.View style={[styles.input_container, inputAnimation]}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for an employee"
                    value={query}
                    onChangeText={handleSearch}
                />
            </Animated.View>
            <Animated.View style={[styles.employee_list, employeeAnimation]}>
                <Text style={[styles.text_black_15, { marginBottom: 10 }]}>Number of employees: {filteredEmployeeList.length}</Text>
                <FlatList
                    data={filteredEmployeeList}
                    renderItem={({ item }) => <EmployeeItem item={item} naigation={naigation} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    employee_container: {
        position: 'absolute',
        zIndex: 1,
    },
    search_button: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
    },
    input_container: {
        marginTop: 10,
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: layout.width - 20,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderRadius: 10
    },
    employee_list: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    container: {
        height: layout.height * 0.12,
        width: layout.width - 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    header_container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
    },
    image_style: {
        height: layout.height * 0.15 * 0.6,
        width: layout.height * 0.15 * 0.6,
        borderRadius: 100
    },
    task_info_container: {
        height: '100%',
        marginLeft: 10,
        justifyContent: 'center'
    },
    text_black_20: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    },
    text_black_15: {
        color: 'black',
        fontSize: 14,
        fontWeight: '500'
    },
    text_red_15: {
        color: 'red',
        fontSize: 14,
        fontWeight: '500'
    },
    view_button: {
        height: '30%',
        width: '80%',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
