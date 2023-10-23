import { Pressable, Text, View } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import style from '../style/style';
import { useEffect } from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game';
import { DataTable } from 'react-native-paper';


export default Scoreboard = ({ route,navigation }) => {

    const [scores, setScores] = useState([])
    

    useEffect(() => {
        const unsunscribe = navigation.addListener('focus', () => {
            getScoreBoardData();
        });
        return unsunscribe;
    }, [navigation]);

    const getScoreBoardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
        }
        catch (e) {
            console.log('Reading scoreboard data failed: ' + e);
        }
    }
    const clearScoreboad = async () => {
        try {
            await AsyncStorage.clear();
            setScores([]);
        }
        catch (e) {
            console.log('Clearing error: ' + e);
        }
    }




        return (
        
            <>
                <Header style={style.header} />
                <View >
                    <Text>Scoreboard here</Text>
                    {scores.length === 0 ?
                        <Text>No scores, it's empty</Text>
                        :
                        scores.map((player, index) => (
                          
                            <DataTable.Row key={player.key}>
                                <DataTable.Cell>{index + 1}.</DataTable.Cell>
                                <DataTable.Cell>{player.name}</DataTable.Cell>
                                <DataTable.Cell>{player.date}</DataTable.Cell>
                                <DataTable.Cell>{player.time}</DataTable.Cell>
                                <DataTable.Cell>{player.points}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                </View>
                <View>
                <Pressable style={style.button} onPress={() => clearScoreboad()}>
                        <Text>Clear scoreboard</Text>
                    </Pressable>
                    
                </View>
                <Footer style={style.footer} />
            </>
          
        )
    }



/*kdbkb*/