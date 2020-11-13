import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfilePsychologist from '../../pages/PatientNavigation/ProfilePsychologist';
import ListPsychologist from '../../pages/PatientNavigation/ListPsychologist';
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../../context/auth';
import Messages from '../../pages/Chat/Messages';
import Avaliation from '../../pages/PatientNavigation/PsychologistAvaliations';
import Schedule from '../../pages/PatientNavigation/Schedule'

const AppStack = createStackNavigator();

const AppRoutes = () => {
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
                alignSelf: 'center',
                marginLeft: 30
            }
        }}>
            <AppStack.Screen name="ListPsychologist" component={ListPsychologist}/>
            <AppStack.Screen name="Schedule" component={Schedule} options={{  title: 'Agendamento', }} />
            <AppStack.Screen name="ProfilePsychologist" component={ProfilePsychologist} options={{  title: 'Perfil', }} />
            <AppStack.Screen name="Avaliation" component={Avaliation} options={{ title: 'Avaliações', }} />
            <AppStack.Screen name="Messages" component={Messages} options={({ route }) => ({ title: route.params.thread.name, })} />
            
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

export default AppRoutes;