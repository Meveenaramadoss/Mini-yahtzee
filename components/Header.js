import { Text, View } from 'react-native';
import style from '../style/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Header() {
    return (
        <View style={style.header}>
            <Text style={style.title}>
            <MaterialCommunityIcons name="dice-multiple" size={35} color="#ffffff" />
                Mini-yahtzee
            <MaterialCommunityIcons name="dice-multiple" size={35} color="#ffffff" />
            </Text>
        </View>
    )
}

/*kdbkb*/