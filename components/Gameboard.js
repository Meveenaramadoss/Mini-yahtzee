import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Footer from "./Footer";
import Header from "./Header";
import { NBR_OF_DICES, NBR_OF_THROWS,SCOREBOARD_KEY, NBR_OF_SCOREBOARD, MAX_SPOT, MIN_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT } from "../constants/Game";
import { Col, Row, Container } from "react-native-flex-grid";
import style from "../style/style";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";



let board = [];

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);


    // Mitkä nopat ovat kiinnitetty 

    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));

    // Noppien silmäluvut 
    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICES).fill(0));

    // Onko silmäluvulla valittu pisteet
    const [selectedDicePoints, setSelectedDicePoints] =
        useState(new Array(MAX_SPOT).fill(false));
    // Kerättyt pisteet

    const [dicePointsTotal, setDicePointsTotal] =
        useState(new Array(MAX_SPOT).fill(0));

    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreBoardData();

        });
        return unsubscribe;
      }, [navigation]);
    

    const dicesRow = [];

    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable key={"dice" + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key={"dice" + dice}
                        size={62}
                        color={getDiceColor(dice)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }
    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}> {getSpotTotal(spot)}</Text>
            </Col>
        )
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === i + 1 ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);

                const newTotalPoints = totalPoints + points[i];
                setTotalPoints(newTotalPoints);
            } else {
                setStatus("You already selected points for " + (i + 1));
                return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            return points[i];
        }
        else {
            setStatus('Throw' + NBR_OF_THROWS + ' times before setting points');
        }
    }

    const savePlayerPoints = async () => {
        const newKey = scores.length + 1;
        const playerPoints = {
            key: newKey, 
            name: playerName,
            date: 'date',           // Päivämäärä tänne funktiolla
            time: 'time',           //Kellonaika " "
            points: 0               //Yhteispisteet [mahdollinen bonuksen mukaan]

        }
        try{
            const newScore = [...scores,playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
        catch(e){
            console.log('Saving scoreboard data failed: ' + e);
        }
    }
    const getScoreBoardData = async () => {
        try {
           const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
           if(jsonValue != null){
               let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
           }
        }
        catch (e) {
            console.log('Read error:  ' + e);
        }
    }
    const throwDices = () => {
        
        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus("Select your points before throwing dices again");
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = "dice-" + randomNumber;
                spots[i] = randomNumber;
            }
        }

        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots);
        setStatus("Select and throw dices again");
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable
                    key={"buttonsRow" + diceButton}
                    onPress={() => selectDicePoints(diceButton)}
                >
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={30}
                        color={getDicePointsColor(diceButton)}
                    >
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }


    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        } else {
            setStatus("You have to throw dices first");
        }
    }

    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : '#dfcd41';
    }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? 'black' : '#dfcd41';
    }
   

 



    return (
        <>
            <Header />
            <View style={style.container} >
            <StatusBar backgroundColor='#eaeaea' style="auto"/>
                <Container fluid>
                    <Row >{dicesRow}</Row>
                </Container>
                <Text >Throws Left: {nbrOfThrowsLeft}</Text>
                <Text style={style.status}>{status}</Text>
                <Pressable onPress={() => throwDices()}>
                    <Text style={style.button}>Throw dices</Text>
                </Pressable>
                <Container fluid>
                    <Row style={style.title1}>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row style={style.title1}>{pointsToSelectRow}</Row>
                </Container>
                <Pressable onPress={() => savePlayerPoints()}>
                    <Text style={style.button}>
                        <MaterialCommunityIcons name='braille' size={30} color='#000000' />
                        Save Points({totalPoints} points)</Text></Pressable>
                <Text style={style.title1}>Player:{playerName}</Text>
            </View>
            <Footer />
        </>
    );
}






