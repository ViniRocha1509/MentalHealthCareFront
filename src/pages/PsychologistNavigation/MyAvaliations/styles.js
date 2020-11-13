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

    avaliationBox: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 20,
        marginBottom: 20
    },

    avaliation: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10
    },

    paramsAvaliation: {
        flex: 1,
        marginLeft: 10
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
        marginTop: 20
    },
    form: {
        flex: 1
    },
    noResult: {
        alignSelf: "center",
        marginTop: "50%",
        fontWeight: "bold",
        fontSize: 16
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    rating: {
        alignItems: "center",
    },
});

export default styles;
