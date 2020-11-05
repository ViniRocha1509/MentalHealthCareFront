import React from 'react';
import ScheduleList from '../../pages/PsychologistNavigation/ScheduleList';
import Profile from '../../pages/PsychologistNavigation/Profile'
import Edit from '../../pages/PsychologistNavigation/Profile/edit'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const AppStack = createStackNavigator();

const ProfileRoute = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Profile" component={Profile}/>
            <AppStack.Screen name="Edit" component={Edit}/>
        </AppStack.Navigator>
    );
}

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
            <Tab.Screen name="Agenda" component={ScheduleList} />
            <Tab.Screen name="Perfil" component={ProfileRoute} />
        </Tab.Navigator>
    );
}

