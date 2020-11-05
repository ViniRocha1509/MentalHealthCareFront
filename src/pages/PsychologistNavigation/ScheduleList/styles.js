import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        height: "100%"
    },

    list: {
        padding: 20,
    },

    listContainer: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 20,
        marginBottom: 20
    },

    image: {
        width: 100,
        height: 100,
        backgroundColor: "#FFF"
    },

    schedule: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    statusUnavailable: {
        fontSize: 16,
        color: "#dc143c",
        marginTop: 5,
        lineHeight: 24
    },

    statusWaiting: {
        fontSize: 16,
        color: "#ff8c00",
        marginTop: 5,
        lineHeight: 24
    },

    containerButton: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },

    statusScheduled: {
        fontSize: 16,
        color: "#4169e1",
        marginTop: 5,
        lineHeight: 24
    },

    statusCompleted: {
        fontSize: 16,
        color: "#2e8b57",
        marginTop: 5,
        lineHeight: 24
    },

    patientValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    specialityValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333"
    },

    paramsSchedule: {
        flexDirection: 'row',
        flex: 1
    },

    paramsScheduleColum: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 20
    },

    buttonList: {
        flex: 1,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        width: "33.3%",
        height: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        marginTop: 5
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center'
    },
    scrollview:
    {
        width: '100%',
        height: '100%',
        marginBottom: 10,
        flexGrow: 1,
        flex: 1
    },

    buttonTextFilter: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },

    clearLink: {
        padding: 10,
        marginTop: 20,
        alignSelf: 'center'
    },
    inputTime: {
        color: '#000000',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 5,
    },
    clearLinkText: {
        color: '#999',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    touchButton: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        marginHorizontal: 20,
    },
    form: {
        flex: 1
    },
});

export default styles;
