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
    },
    image: {
        alignSelf: 'center'
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
    signUpLink: {
        padding: 10,
        marginTop: 20,
    },
    signUpLinkText: {
        color: '#999',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    RadioButtons: {
        flexDirection: 'row',
        flex: 1,
        alignSelf: "center"
    },
    RadioButton: {
        margin: 10
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
    },
});

export default styles