import React from 'react';

import { useAuth } from '../context/auth';

import AuthRoutes from './auth.routes';
import AdminRoutes from './route_admin/admin.routes';
import TabPatient from './tab_patient/app.tab.routes';
import TabPsychologist from './tab_psychologist/app.tab.routes';
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
            return <TabPsychologist />
        else if (user.typeUser == 2)
            return <TabPatient />
        else if (user.typeUser == 3)
            return <AdminRoutes />
        else return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#666" />
            </View>)
    } else {
        return <AuthRoutes />
    }
}

export default Routes;