import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SingnIn from '../pages/SingnIn';
import SingnUp from '../pages/SingnUp';
import ListPsychologist from '../pages/PatientNavigation/ListPsychologist';
import { useAuth } from '../context/auth';

const AuthStack = createStackNavigator();
const AuthRoutes = () => {
    const { SingOut } = useAuth();
    return (
        <AuthStack.Navigator screenOptions={{
            title: 'Psicologos',
            headerStyle: {
                backgroundColor: '#FC6663',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
                marginRight: '10%'
            }
        }}>
            <AuthStack.Screen name="SingnIn" component={SingnIn} options={{ headerShown: false }} />
            <AuthStack.Screen name="SingnUp" component={SingnUp} options={{ headerShown: false }} />
            <AuthStack.Screen name="ListPsychologist" component={ListPsychologist} />
        </AuthStack.Navigator>
    );
}

export default AuthRoutes;