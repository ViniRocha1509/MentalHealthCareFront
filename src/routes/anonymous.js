import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListPsychologist from '../pages/PatientNavigation/ListPsychologist';
import { StyleSheet } from 'react-native';

const AppStack = createStackNavigator();

const AppRoutes = () => {
    return (
        <AppStack.Navigator screenOptions={{
            title: 'Psicologos',
            headerStyle: {
                backgroundColor: '#FC6663',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
            }
        }}>
            <AppStack.Screen name="ListPsychologist" component={ListPsychologist} />
        </AppStack.Navigator>
    );
}
const styles = StyleSheet.create({
    linkText: {
        alignItems: 'flex-start',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
        marginTop: 17
    },

    Anonymous: {
        flex: 1,
    }
});

export default AppRoutes;