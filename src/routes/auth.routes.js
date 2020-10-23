import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SingnIn from '../pages/SingnIn';
import SingnUp from '../pages/SingnUp';
import { useAuth } from '../context/auth';

const AuthStack = createStackNavigator();
const AuthRoutes = () => {
    const { SingOut } = useAuth();
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SingnIn" component={SingnIn} />
            <AuthStack.Screen name="SingnUp" component={SingnUp} />
        </AuthStack.Navigator>
    );
}

export default AuthRoutes;