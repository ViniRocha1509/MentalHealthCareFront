import React from 'react';
import ProfileRoute from './profile.routes'
import ScheduleRoute from './schedule.routes'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function TapPsychologist() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Agenda':
                            iconName = 'calendar';
                            break;
                        case 'Perfil':
                            iconName = 'user';
                            break;
                        case 'Post':
                            iconName = 'edit';
                            break;
                        case 'Notifications':
                            iconName = 'bell';
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
            <Tab.Screen name="Agenda" component={ScheduleRoute} />
            <Tab.Screen name="Perfil" component={ProfileRoute} />
        </Tab.Navigator>
    );
}

