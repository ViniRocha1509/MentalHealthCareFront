import React, { useState } from 'react';
import {
    Image,
    Text,
    View,
    TextInput,
    TouchableHighlight,
} from 'react-native';
import styles from './styles'
import { useAuth } from '../../context/auth';

const SignIn = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    function handleSignIn() {
        signIn({ email, password });
    }

    const { navigation } = props;

    return (
        <View style={styles.container}>
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
                <TouchableHighlight style={styles.touchButton} onPress={() => handleSignIn()}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.containerButton}>
                <View style={styles.forgotPassword}>
                    <TouchableHighlight>
                        <Text style={styles.linkText}>Esqueceu a senha?</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.Anonymous}>
                    <TouchableHighlight>
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