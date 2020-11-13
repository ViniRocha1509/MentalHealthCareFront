import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import Reactotron from 'reactotron-react-native';
import api from '../../../services/api';
import styles from './styles';
import { showError, showSucess } from '../../../common';

import CalendarStrip from 'react-native-calendar-strip';
import { FlatList } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAuth } from '../../../context/auth';

const Schedule = ({ navigation }) => {
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState(0);
    const [timeSchedule, setTimeSchedule] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [hour, setHour] = useState(0);
    const { user } = useAuth();
    const workingHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const numColumns = 3;

    useEffect(() => {
    }, []);

    const formatData = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }
        return data;
    };

    const createTwoButtonAlert = () =>
        Alert.alert(
            "Deseja indisponibilizar: ",
            `${day}/${month} ás ${hour}:00`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancelar"
                },
                {
                    text: "Confirmar",
                    onPress: () => {
                        setSpinner(true);
                        unavailableHours()
                    }
                }
            ],
            { cancelable: false }
        );

    const unavailableHours = async () => {
        if (day.length === 0 || month.length === 0 || hour.length === 0) {
            showError("preencha os campos para prosseguir");
        } else {
            try {
                const response = await api.post('/Schedule/UnavailableHours', {
                    Day: day,
                    Month: month,
                    Hour: hour,
                });
                Reactotron.log(navigation);
                navigation.navigate("Agenda");
                setSpinner(false);
            } catch (_err) {
                showError(_err.response.data);
                setSpinner(false);
            }
        }
    };

    async function onSelectDate(date) {
        var dateSchedule = new Date(date)
        setDay(dateSchedule.getDate());
        setMonth(dateSchedule.getMonth() + 1);
        try {
            if (date === undefined) return;
            const psychologist = await api.get(`/psychologist/profileByUser/${user.id}`);
            const response = await api.get(`/Schedule/GetTimeByDate?Day=${dateSchedule.getDate()}&Month=${dateSchedule.getMonth() + 1}&PsychologistId=${psychologist.data.id}`);
            const time = response.data;
            setTimeSchedule(time);
            setSpinner(false);
        } catch (error) {
            showError(error.response.data);
            setSpinner(false);
        }
    }

    function onSelectHour(hour) {
        setHour(hour);
    }

    const renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View />;
        }
        return (
            <TouchableOpacity disabled={day > 0 ? timeSchedule.includes(item) === false ? false : true : true} style={day > 0 ? timeSchedule.includes(item) === false
                ? item === hour ? styles.pressedButton : styles.touchButton : styles.touchButtonDisabled : styles.touchButtonDisabled}
                onPress={() => onSelectHour(item)}>
                <Text>{item}:00</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <CalendarStrip
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                calendarHeaderStyle={{ color: 'white' }}
                calendarColor={'#FC6663'}
                dateNumberStyle={{ color: 'white' }}
                dateNameStyle={{ color: 'white' }}
                highlightDateNumberStyle={{ color: 'yellow' }}
                highlightDateNameStyle={{ color: 'yellow' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey' }}
                onDateSelected={(date) => {
                    setSpinner(true);
                    onSelectDate(date);
                }}
                minDate={Date.now()}
                iconContainer={{ flex: 0.1 }}
            />
            <View style={styles.DateView}>
                {day > 0
                    ?
                    <View>
                        <FlatList
                            data={formatData(workingHours, numColumns)}
                            renderItem={renderItem}
                            numColumns={numColumns}
                            keyExtractor={item => item.toString()}
                        />
                    </View >
                    :
                    <Text style={styles.DateText}>Selecione uma data para indisponibilizar</Text>
                }

            </View>
            {day > 0
                ?
                <View style={styles.timeSchedule}>
                    {/* S<Text style={styles.timeScheduleText}>Seu agendamento está para {day}/{month} as {hour}:00 </Text> */}
                    <TouchableHighlight style={styles.touchButtonConfirm} onPress={createTwoButtonAlert}>
                        <Text style={styles.buttonTextConfirm}>Confirmar</Text>
                    </TouchableHighlight>
                </View>
                :
                <View />
            }
        </SafeAreaView>
    );
}

export default Schedule;