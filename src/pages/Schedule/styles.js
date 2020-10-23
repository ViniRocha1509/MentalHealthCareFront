import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    touchButton: {
        padding: 20,
        width: "31%",
        borderRadius: 5,
        backgroundColor: '#FC6663',
        margin: 5,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    touchButtonDisabled: {
        padding: 20,
        width: "31%",
        borderRadius: 5,
        backgroundColor: '#a9a9a9',
        margin: 5,
        marginHorizontal: 5,
        alignItems: 'center'
    },

    pressedButton: {
        padding: 20,
        width: "31%",
        borderRadius: 5,
        backgroundColor: '#2196F3',
        margin: 5,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    DateView: {
        // alignItems: 'center',
    },
    DateText: {
        fontSize: 25,
        color: "#a9a9a9",
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    timeSchedule: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-end'
    },
    timeScheduleText: {
        fontSize: 20,
        color: "#696969",
        alignSelf: 'center'
    },
    touchButtonConfirm: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        margin: 10,
        marginHorizontal: 20,
    },

    buttonTextConfirm: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default styles;