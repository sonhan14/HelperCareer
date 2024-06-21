import { Image, StyleSheet, Text, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import { images } from "../../images"


export const WellcomeScreen = () => {
    return(
        <View style={{flex: 1}}>
            <View style={styles.image}>
                <Image source={images.wellcome_pic} resizeMode='contain' style={{height: '80%', width: '80%'}}/>
            </View>

            <View style={styles.slogan_container}>
                <Text style={styles.text_blue_30}>Discover Your </Text>
                <Text style={styles.text_blue_30}>Dream Job here</Text>

                <Text style={{marginTop: 20}}>Explore all the existing job roles based on your</Text>
                <Text>interest and study major</Text>
            </View>

            <View style={styles.button_container}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: layout.height * 0.5,
        width: layout.width,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    slogan_container: {
        height: layout.height * 0.3,
        width: layout.width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    text_blue_30: {
        color: '#1F41BB',
        fontSize: 30
    },
    button_container: {

    }
})