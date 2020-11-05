import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },


    paramsUser: {
        padding: 20,
        flexDirection: 'row',
    },

    paramsPsy: {
        flexDirection: 'column',
        flex: 1,
        padding: 20,

    },

    paramsPsyColum: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 10
    },

    rating: {
        alignItems: "flex-start",
    },

    scrollview:
    {
        width: '100%',
        height: '100%',
        marginBottom: 10,
        flexGrow: 1,
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
        fontSize: 17,
        color: "#999",
        lineHeight: 20
    },

    adress: {
        fontSize: 17,
        color: "#999",
        marginTop: 10,
        lineHeight: 20
    },

    description: {
        fontSize: 17,
        color: "#999",
        marginTop: 10,
        lineHeight: 20
    },

    crmValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    specialityValue: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333"
    },

    adressValue: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333"
    },

    descriptionValue: {
        fontSize: 14,
        // fontWeight: "bold",
        color: "#333"
    },

    image: {
        width: 100,
        height: 120,
        backgroundColor: "#FFF"
    },
});

export default styles;
