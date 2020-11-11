import React from 'react';
import ListRoute from './list.routes';
import ProfileRoute from './profile.routes'
import MyScheduleRoute from './mySchedule.routes'
import EmergencyRoute from './emergency.routes'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
export default function TapPsychologist() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Lista Psicologo':
                            iconName = 'list';
                            break;
                        case 'Perfil':
                            iconName = 'user';
                            break;
                        case 'Minhas Consultas':
                            iconName = 'calendar';
                            break;
                        case 'Emergência':
                            iconName = 'alert-circle';
                            break;
                        case 'Settings':
                            iconName = 'settings';
                            break;
                        default:
                            iconName = 'circle';
                            break;
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                showLabel: false,
            }}
        >
            <Tab.Screen name="Lista Psicologo" component={ListRoute} />
            <Tab.Screen name="Minhas Consultas" component={MyScheduleRoute} />
            <Tab.Screen name="Emergência" component={EmergencyRoute} />
            <Tab.Screen name="Perfil" component={ProfileRoute} />
        </Tab.Navigator>
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


