import { Text, View } from "react-native"
import firestore from '@react-native-firebase/firestore';
import { useEffect } from "react";
import { RootStackParamList, RootTabParamList } from "../../navigations/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";


type HomeScreenRouteProp = RouteProp<RootTabParamList, 'Home'>;
type BottomTabNavigatorProps = {
    route: { params: RootStackParamList['MainTabs'] };
};


export const HomeScreen = ({ route }: BottomTabNavigatorProps) => {
    const userID = route.params.userId
    
    
    const getData = async () =>{
        const data = (await firestore().collection('profile').where('user_id', '==', userID).get()).docs
        
        console.log(data);
        
    }
    
    useEffect(() => {
        getData()
    }, [])

    return(
        <View>
            <Text>Heello</Text>
        </View>
    )
}