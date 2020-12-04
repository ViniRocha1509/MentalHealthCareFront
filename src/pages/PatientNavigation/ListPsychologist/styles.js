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

    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333"
    },

    crm: {
        fontSize: 16,
        color: "#999",
        marginTop: 5,
        lineHeight: 24
    },

    speciality: {
        fontSize: 15,
        color: "#999",
        marginTop: 5,
        lineHeight: 20
    },

    adress: {
        fontSize: 15,
        color: "#999",
        marginTop: 5,
        lineHeight: 20
    },

    crmValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    specialityValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333"
    },

    adressValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333"
    },

    image: {
        width: 100,
        height: 100,
        backgroundColor: "#FFF",
        borderRadius: 5
    },

    paramsPsy: {
        flexDirection: 'row',
        flex: 1
    },

    paramsPsyColum: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 10
    },

    rating: {
        flexDirection: "column",
        flex: 1,
        margin: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },

    containerButton: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
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
    
    touchButtonDisabled: {
        flex: 1,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#a9a9a9',
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
    form: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flex: 1
    },
    input: {
        paddingHorizontal: 20,
        width: "75%",
        borderRadius: 5,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        marginBottom: 15,
        fontSize: 16,
    },
    inputAdress: {

    },
    touchButton: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#FC6663',
        alignSelf: 'stretch',
        marginHorizontal: 20,
    },

    touchButtonCep: {
        alignSelf: 'stretch',
    },

    buttonTextFilter: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },

    buttonTextCep: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10
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

    inputCep: {
        flexDirection: 'row',
        flex: 1,
    },

    inputSlider: {
        alignItems: "center",
        justifyContent: "center"
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    noResult: {
        alignSelf: "center",
        marginTop: "50%",
        fontWeight: "bold",
        fontSize: 16
    }
});

export default styles;
