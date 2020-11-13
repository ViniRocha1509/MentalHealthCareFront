import React from 'react';
import ProfileRoute from './profile.routes'
import ScheduleRoute from './schedule.routes'
import AvaliationRoute from './avaliation.routes'
import Unavailable from './unavailableSchedule.routes'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Chat from '../chat_route/chat.routes'

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
                        case 'Chat':
                            iconName = 'message-circle';
                            break;
                        case 'Avaliação':
                            iconName = 'star';
                            break;
                        case 'Indiponibilizar':
                            iconName = 'slash';
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
            <Tab.Screen name="Indiponibilizar" component={Unavailable} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Avaliação" component={AvaliationRoute} />
            <Tab.Screen name="Perfil" component={ProfileRoute} />
        </Tab.Navigator>
    );
}

