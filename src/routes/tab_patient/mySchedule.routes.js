import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../../context/auth';
import ScheduleList from '../../pages/PatientNavigation/MySchedules';
import Rates from '../../pages/PatientNavigation/RatingSchedule';

const AppStack = createStackNavigator();

const PsychologistRoutes = () => {
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
            title: 'Paciente',
            headerStyle: {
                backgroundColor: '#FC6663',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
                marginLeft: 30
            }
        }}>
            <AppStack.Screen name="Schedule" component={ScheduleList} options={{ title: 'Minhas consultas', }} />
            <AppStack.Screen name="Rates" component={Rates} options={{ title: 'Avaliação', }} />
        </AppStack.Navigator>
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

export default PsychologistRoutes;