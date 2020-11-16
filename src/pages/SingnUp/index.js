import React, { useState } from 'react'
import { showError } from '../../common';
import {
    Image,
    Text,
    TextInput,
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';

import { RadioButton } from 'react-native-paper'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import styles from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import api from '../../services/api';
import reactotron from 'reactotron-react-native';

const SignUp = (props) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastname] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp, signUpPsychologist } = useAuth();
    const { navigation } = props;
    const [type, setType] = useState(1);
    const [crm, setCrm] = useState('');
    const [phone, setPhone] = useState('');
    const [specialtyJson, setSpecialtyJson] = useState([]);
    const [cep, setCep] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [isCepSet, setIsCepSet] = useState(false);
    const [gender, setGender] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, SetItems] = useState([]);

    const onSelectedItemsChange = (selectedItems) => {
        // Set Selected Items
        setSelectedItems(selectedItems);
        setSpecialtyJson(selectedItems);
    };

    async function handleSignUp() {
        try {
            if (type === 1) {
                await signUp({ email, name, lastName, cpf, password, confirmPassword });
            } else {
                await signUpPsychologist({ email, name, lastName, cpf, password, confirmPassword }, { crm, phone, cep, city, state, district, street, number, complement, gender: parseInt(gender, 10), specialtyJson })
            }
            navigation.navigate('SingnIn');
        } catch (error) {
            reactotron.log(error);
            showError(error.message);
        }
    }

    const loadViaCep = async () => {
        try {
            if (cep === undefined) return;
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const { ...infos } = response.data;
            // const filter = { ...this.state.filter, district: infos.bairro, cep: infos.cep, complement: infos.complemento, street: infos.logradouro, state: infos.uf
            //     , city: infos.localidade };
            setCep(infos.cep);
            setDistrict(infos.bairro);
            setComplement(infos.complemento);
            setStreet(infos.logradouro);
            setState(infos.uf);
            setCity(infos.localidade);
            setIsCepSet(true);

        } catch (error) {
            showError(error);
        }
    }

    const loadSpeciality = async () => {
        try {
            const response = await api.get('/psychologist/getSpeciality');
            SetItems(response.data);
        } catch (error) {
            showError(error);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <View style={styles.form}>
                    <Image source={require('../../../assets/images/logo_Mhc.png')}
                        style={styles.image} />
                    <RadioButton.Group onValueChange={value => {
                        setType(value)
                        if (value == 2)
                            loadSpeciality();
                    }} value={type} >
                        <View style={styles.RadioButtons}>
                            <View style={styles.RadioButton}>
                                <Text>Paciente</Text>
                                <RadioButton value={1} />
                            </View>
                            <View style={styles.RadioButton}>
                                <Text>Psicologo</Text>
                                <RadioButton value={2} />
                            </View>
                        </View>
                    </RadioButton.Group>
                    <TextInput placeholder='E-mail' value={email}
                        style={styles.input} onChangeText={email => setEmail(email)}
                        autoCapitalize="none"
                        autoCorrect={false} />
                    <TextInput placeholder='Nome' value={name}
                        style={styles.input} onChangeText={name => setName(name)}
                        autoCapitalize="none"
                        autoCorrect={false} />
                    <TextInput placeholder='Sobrenome' value={lastName}
                        style={styles.input} onChangeText={lastName => setLastname(lastName)}
                        autoCapitalize="none"
                        autoCorrect={false} />
                    <TextInput placeholder='CPF' value={cpf}
                        style={styles.input} onChangeText={cpf => setCpf(cpf)}
                        autoCapitalize="none"
                        autoCorrect={false} />

                    {type === 2 &&

                        <View style={{ flex: 1, width: '100%' }}>
                            <View style={styles2.container}>
                                <SectionedMultiSelect
                                    items={items}
                                    IconRenderer={Icon}
                                    uniqueKey="id"
                                    selectText="Selecione a especialidade"
                                    onSelectedItemsChange={onSelectedItemsChange}
                                    selectedItems={selectedItems}
                                />
                            </View>

                            <DropDownPicker
                                items={[
                                    { label: 'Masculino', value: '1' },
                                    { label: 'Feminino', value: '2' },
                                ]}
                                searchable={true}
                                placeholder="Selecione um gênero"
                                searchablePlaceholder="Search for an item"
                                searchablePlaceholderTextColor="gray"
                                containerStyle={{ height: 40, width: '100%', marginBottom: 20 }}
                                style={{ backgroundColor: '#fafafa', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={value => setGender(value.value)}
                            />
                            < TextInput placeholder='CRM' value={crm}
                                style={styles.input} onChangeText={value => setCrm(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            < TextInput placeholder='Informe o número do consultório' value={phone}
                                style={styles.input} onChangeText={value => setPhone(value)}
                                autoCapitalize="none"
                                keyboardType="numeric"
                                autoCorrect={false} />
                            <View style={styles.inputCep}>
                                <TextInput placeholder='CEP' value={cep}
                                    style={styles.textInputCep} onChangeText={(value) => setCep(value)}
                                    autoCapitalize="none"
                                    autoCorrect={false} />
                                <TouchableHighlight style={styles.touchButtonCep} onPress={loadViaCep}>
                                    <Text style={styles.buttonTextCep}>Buscar</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }
                    {isCepSet &&
                        <View style={{ flex: 1, width: '100%' }}>
                            <TextInput placeholder='Rua' value={street}
                                style={styles.input} onChangeText={(value) => setStreet(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <TextInput placeholder='Cidade' value={city}
                                style={styles.input} onChangeText={(value) => setCity(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <TextInput placeholder='Estado' value={state}
                                style={styles.input} onChangeText={(value) => setState(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <TextInput placeholder='Bairro' value={district}
                                style={styles.input} onChangeText={(value) => setDistrict(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <TextInput placeholder='Número' value={number}
                                style={styles.input} onChangeText={(value) => setNumber(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <TextInput placeholder='Complemento' value={complement}
                                style={styles.input} onChangeText={(value) => setComplement(value)}
                                autoCapitalize="none"
                                autoCorrect={false} />
                        </View>
                    }
                    <TextInput placeholder='Senha' value={password}
                        style={styles.input} onChangeText={password => setPassword(password)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry />
                    <TextInput placeholder='Confirmar Senha' value={confirmPassword}
                        style={styles.input} onChangeText={confirmPassWord => setConfirmPassword(confirmPassWord)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry />
                    <TouchableHighlight style={styles.touchButton} onPress={() => handleSignUp()}>
                        <Text style={styles.buttonText}>Criar Conta</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.signUpLink} onPress={() => { navigation.navigate('SingnIn') }}>
                        <Text style={styles.signUpLinkText}>Já possuo uma conta</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10

    },
    titleText: {
        padding: 8,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headingText: {
        padding: 8,
    },
});

export default SignUp;