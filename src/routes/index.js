import React from 'react';

import { useAuth } from '../context/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { ActivityIndicator, View } from 'react-native';

const Routes = () => {
    const { signed, loading } = useAuth();
    if (loading && (signed === null || signed)) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        )
    }


    return (
        signed ?
            <AppRoutes />
            :
            <AuthRoutes />
    );;
}

export default Routes;