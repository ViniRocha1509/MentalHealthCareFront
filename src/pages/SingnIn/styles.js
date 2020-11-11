import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    image: {
        height: '35%',
        marginBottom: 30,
    },
    title: {
        fontSize: 40,
        marginBottom: 10,
        fontFamily: 'Lato',
        color: 'red'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    containerInput: {
        alignItems: 'center',
        width: '100%'
    },
    containerButton: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5'
    },
    spinnerTextStyle: {
        color: '#FFF'
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
    linkText: {
        alignItems: 'flex-start',
        color: '#1e90ff',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
        marginTop: -10,
    },
    forgotPassword: {
        flex: 1,
        alignItems: 'flex-start',
    },
    Anonymous: {
        flex: 1,
        alignItems: 'flex-end',
    }
});

export default styles;