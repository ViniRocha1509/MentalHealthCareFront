import React from 'react';

import { useAuth } from '../context/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import TabAppRoutes from './tab_patient/app.tab.routes';
import PsychologistRoutes from './psychologist.routes';
import { ActivityIndicator, View } from 'react-native';

const Routes = () => {
    const { signed, loading, user } = useAuth();

    if (loading && (signed === null || signed)) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        )
    }
    if (signed) {
        if (user.typeUser == 1)
            return <PsychologistRoutes />
        else if (user.typeUser == 2)
            return <TabAppRoutes />
        else return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#666" />
            </View>)
    } else {
        return <AuthRoutes />
    }
}

export default Routes;