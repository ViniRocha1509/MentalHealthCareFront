import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    textInfo: {
        alignSelf: "center",
        marginTop: "50%",
        fontWeight: "bold",
        fontSize: 15,
        padding: 10,
        marginBottom: 10
    },
    touchButton: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        margin: 0,
        marginHorizontal: 20,
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default styles;
