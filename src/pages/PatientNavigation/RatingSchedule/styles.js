import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollview:
    {
        width: '100%',
        height: '100%',
        marginBottom: 10,
        flexGrow: 1,
    },
    form: {
        width: '100%',
        height: '100%',
        padding: 10
    },
    saveButton: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        margin: 0,
        marginHorizontal: 20,
    },

    saveText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },

    inputArea: {
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginBottom: 15,
        marginHorizontal: 20,
        fontSize: 12,
        borderColor: '#000',
        borderWidth: 0.5,
    },

    rating: {
        flexDirection: "column",
        flex: 1,
        margin: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});

export default styles;
