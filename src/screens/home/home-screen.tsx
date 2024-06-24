import { Text, View } from "react-native"

import { useEffect } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";


type HomeScreenRouteProp = RouteProp<RootTabParamList, 'Home'>;



export const HomeScreen = () => {
    

    return(
        <View>
            <Text>Heello</Text>
        </View>
    )
}