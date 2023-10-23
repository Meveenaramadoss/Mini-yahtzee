import { useState } from "react";
import { Text, View, TextInput, Pressable, Keyboard } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header  from "./Header";
import  Footer  from "./Footer";
import style from "../style/style";
import { NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, MIN_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT } from "../constants/Game";

export default Home = ({ navigation }) => {
    const [playerName, setPlayerName] = useState("");
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    };

    return (
        <>
            <Header />
            <View style={style.container}>
                <MaterialCommunityIcons name="information" size={80} color='#dfcd41' />
                {!hasPlayerName ?
                    <>
                        <Text style={style.title}>
                            For Scoreboard enter your name Here...
                            </Text>
                        <TextInput style={style.textinput}onChangeText={setPlayerName} autoFocus={true}></TextInput>
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}>
                            <Text style={style.button}>Submit</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <Text style={style.paragraph}>Rules of the game...</Text>
                        <Text multiline='true' style={style.paragraph}>
                            <MaterialCommunityIcons name="dice-multiple" size={30} color="#000000" />
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS}
                            throws. After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected. 
                            The order for selecting those is free.
                        </Text>
                        <Text> </Text>
                        <Text multiline='true' style={style.paragraph}>
                        <MaterialCommunityIcons name="alpha" size={30} color="#000000" />
                            POINTS: After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from 
                            {MIN_SPOT} to {MAX_SPOT} again.
                        </Text>
                        <Text> </Text>
                        <Text multiline='true' style={style.paragraph}>
                        <MaterialCommunityIcons name="arrow-collapse-all" size={30} color="#000000" />
                            GOAL: To get points as much as possible.
                            {BONUS_POINTS_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS}
                            points more
                            </Text>
                            <Text> </Text>
                        <Text style={style.title}>Good Luck! {playerName}</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Gameboard', { player: playerName })}>
                            <Text style={style.button}>Start Game</Text>
                        </Pressable>
                    </>
                }
            </View>
            <Footer />
        </>
    )

}
/*kdbkb*/