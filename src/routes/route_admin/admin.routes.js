import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '../../context/auth';
import List from '../../pages/AdminNavigation/ListPsychologist'
import { createStackNavigator } from '@react-navigation/stack';
const AppStack = createStackNavigator();

const AdminStack = () => {
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
            <AppStack.Screen name="List" component={List} options={{ title: 'Lista Psicologo', }} />
        </AppStack.Navigator>
    );
}

export default AdminStack;

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