import { StyleSheet } from "react-native";
import { layout } from "../../constants/dimensions/dimension";
import { color } from "../../constants/colors/color";

export const login_styles = StyleSheet.create({
    login_image_container: {
        width: layout.width,
        height: layout.height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    hello_container: {
        height: layout.height * 0.15,
        width: layout.width,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    wellcome_container: {
        width: '100%',
        height: '30%',
        marginBottom: 10
    },
    text_title: {
        color: color.link_text,
        fontSize: 30,
        fontWeight: '500'
    },
    text_button: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    text_15: {
        color: color.primary_text,
        fontSize: 15,
        fontWeight: '500'
    },
    text_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500'
    },
    sign_in_container: {
        width: layout.width,
        height: layout.height * 0.4,
        paddingHorizontal: 20,
        justifyContent: 'space-between'

    },
    input_container: {
        width: '100%',
        height: '30%',
    },
    forgot_password_container: {
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    forgot_password: {
        height: '100%',
        justifyContent: 'center'
    },
    signin_button_disable: {
        backgroundColor: color.button_color,
        width: '100%',
        height: '20%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '20%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_input: {
        width: '100%',
        height: '70%',
        backgroundColor: color.text_input,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D4D7E3',
        marginTop: 5
    },
    sign_up_container: {
        height: layout.height * 0.2,
        width: layout.width,
        paddingHorizontal: 20,
        justifyContent: 'center',

    },
    sign_up_title: {
        height: '30%',
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    noti_container: {
        width: layout.width - 20,
        height: layout.height * 0.1,
        backgroundColor: '#BCC7F5',
        borderRadius: 20,
        position: 'absolute',
        top: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    text_input_container: {
        height: '100%',
        flexDirection: 'row',
        position: 'relative'
    },
    eyeIconContainer: {
        height: '70%',
        justifyContent: 'center',
        marginTop: 5,
        position: 'absolute',
        right: 10
    },
})