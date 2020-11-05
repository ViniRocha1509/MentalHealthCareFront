import React from 'react';
import AppRoute from '../app.routes';
import Profile from '../../pages/PatientNavigation/Profile'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../../context/auth';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const AppStack = createStackNavigator();

const ProfileStack = () => {
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
            <AppStack.Screen name="Profile" component={Profile} options={{ title: 'Perfil', }} />
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
                        case 'Lista Psicologo':
                            iconName = 'list';
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
            <Tab.Screen name="Lista Psicologo" component={AppRoute} />
            <Tab.Screen name="Perfil" component={ProfileStack} />
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


