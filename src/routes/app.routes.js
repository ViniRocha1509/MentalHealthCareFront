import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListPsychologist from '../pages/ListPsychologist';
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../context/auth';

import Schedule from '../pages/Schedule'

const AppStack = createStackNavigator();

const AppRoutes = () => {
    const { signOut } = useAuth();
    return (
        <AppStack.Navigator screenOptions={{
            headerRight: () => (
                <View style={styles.Anonymous}>
                    <TouchableHighlight onPress={signOut}>
                        <Text style={styles.linkText}>Sair</Text>
                    </TouchableHighlight>
                </View>
            ),
            title: 'Psicologos',
            headerStyle: {
                backgroundColor: '#FC6663',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center'
            }
        }}>
            <AppStack.Screen name="ListPsychologist" component={ListPsychologist}
            />
            <AppStack.Screen name="Schedule" component={Schedule} options={{  title: 'Agendamento', }} />
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