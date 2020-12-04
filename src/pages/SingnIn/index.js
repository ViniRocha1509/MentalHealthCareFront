import React, { useEffect, useState } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableHighlight,
} from 'react-native';
import styles from './styles'
import { useAuth } from '../../context/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import { set } from 'react-native-reanimated';
import { showError } from '../../common';

const SignIn = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);
    const { signIn } = useAuth();

    async function handleSignIn() {
        try {
            setSpinner(true);
            await signIn({ email, password });
        } catch (error) {
            setSpinner(false);
            showError(error.message);
        }
    }

    const { navigation } = props;

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.containerInput}>
                <Image source={require('../../../assets/images/logo_Mhc.png')} resizeMode="contain"
                    style={styles.image} />
                <Text style={styles.title}>MHC</Text>
                <TextInput placeholder='E-mail' value={email}
                    style={styles.input} onChangeText={email => setEmail(email)}
                    autoCapitalize="none"
                    autoCorrect={false} />
                <TextInput placeholder='Senha' value={password}
                    style={styles.input} onChangeText={password => setPassword(password)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry />
                <TouchableHighlight style={styles.touchButton} onPress={() => {
                    handleSignIn();
                }}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.containerButton}>
                <View style={styles.Anonymous}>
                    <TouchableHighlight onPress={() => { navigation.navigate('ListPsychologist', { isOff: true }) }}>
                        <Text style={styles.linkText}>Entra anônimo</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <TouchableHighlight style={styles.signUpLink} onPress={() => { navigation.navigate('SingnUp') }}>
                <Text style={styles.signUpLinkText}>Criar conta grátis</Text>
            </TouchableHighlight>
        </View>
    );
};
export default SignIn;