import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
    image: {
        alignSelf: 'center',
        width: 100,
        height: 130,
        borderRadius: 5,
    },

    touchButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        margin: 5,
        marginHorizontal: 140,
        textAlign: 'center'
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 25,
        alignSelf: 'center',
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
    input: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        marginBottom: 15,
        marginHorizontal: 20,
        fontSize: 16,
        borderColor: '#000',
        borderWidth: 0.5
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

    touchButtonCep: {
        alignSelf: 'stretch',
        marginLeft: 10
    },
    buttonTextCep: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10
    },
    inputCep: {
        flexDirection: 'row',
        flex: 1,
        marginLeft: 5
    },
    textInputCep: {
        paddingHorizontal: 20,
        width: "70%",
        marginLeft: 15,
        borderRadius: 5,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        marginBottom: 15,
        fontSize: 16,
        borderColor: '#000',
        borderWidth: 0.5
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});

export default styles;
