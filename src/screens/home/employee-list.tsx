import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    isEmployee: boolean,
    employeeList: iUser[],
    naigation: HomeScreenRouteProp,
    handleCloseEmployeeModal: () => void
}

const EmployeeItem = ({ item, naigation, handleCloseEmployeeModal }: { item: iUser, naigation: HomeScreenRouteProp, handleCloseEmployeeModal: () => void }) => {
    if (!item) {
        return
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header_container} onPress={() => {
                handleCloseEmployeeModal()
                naigation.navigate('EmployeeProfile', { employeeId: item.id })
            }}>
                <Image source={item.avatar === undefined ? images.avartar_pic : { uri: item.avatar }} resizeMode='cover' style={styles.image_style} />
                <View style={styles.task_info_container}>
                    <Text style={styles.text_black_20}>{item.last_name} {item.first_name}</Text>
                    <Text style={styles.text_black_15}>{item.birthday}</Text>
                    <Text style={styles.text_black_15}>Gender: {item.gender}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const EmployeeListHome = ({ isEmployee, employeeList, naigation, handleCloseEmployeeModal }: EmployeeListHomeProps) => {
    const [query, setQuery] = useState<string>('');
    const [filteredEmployeeList, setFilteredEmployeeList] = useState<iUser[]>(employeeList);

    useEffect(() => {
        setFilteredEmployeeList(employeeList);
    }, [employeeList]);

    useEffect(() => {
        if (!isEmployee) {
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

    return (
        <Modal
            animationType={'slide'}
            visible={isEmployee}
        >
            <View style={[styles.employee_container,]}>
                <TouchableOpacity style={styles.search_button} onPress={() => handleCloseEmployeeModal()}>
                    <Icon name="remove" color={'black'} size={25} />
                </TouchableOpacity>
                <View style={[styles.input_container]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search for an employee"
                        value={query}
                        onChangeText={handleSearch}
                    />
                </View>
                <View style={[styles.employee_list,]}>
                    <Text style={[styles.text_black_15, { marginBottom: 10 }]}>Number of employees: {filteredEmployeeList.length}</Text>
                    <FlatList
                        data={filteredEmployeeList}
                        renderItem={({ item }) => <EmployeeItem item={item} naigation={naigation} handleCloseEmployeeModal={handleCloseEmployeeModal} />}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    employee_container: {
        flex: 1
    },
    search_button: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        top: 5,
        left: 5
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
        marginBottom: 15,
        borderBottomWidth: 0.5
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
