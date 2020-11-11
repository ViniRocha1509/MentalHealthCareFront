import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage from '@react-native-firebase/storage';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { showError } from '../../../common';
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
import styles from './stylesEdit';
import DropDownPicker from 'react-native-dropdown-picker';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import api from '../../../services/api';
import reactotron from 'reactotron-react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

class Edit extends React.Component {
    componentDidMount() {
        this.loadSpeciality();
        reactotron.log(this.props.route.params.profile);
    }

    state = {
        email: this.props.route.params.user.email ?? '',
        image: this.props.route.params.user.image ?? '',
        name: this.props.route.params.user.name ?? '',
        lastName: this.props.route.params.user.lastName ?? '',
        cpf: this.props.route.params.user.cpf ?? '',
        crm: this.props.route.params.profile.crm ?? '',
        specialtyJson: this.props.route.params.profile.getSpecialtyJson ?? [],
        cep: this.props.route.params.profile.cep ?? '',
        state: this.props.route.params.profile.state ?? '',
        city: this.props.route.params.profile.city ?? '',
        district: this.props.route.params.profile.district ?? '',
        street: this.props.route.params.profile.street ?? '',
        number: this.props.route.params.profile.number ?? '',
        complement: this.props.route.params.profile.complement ?? '',
        gender: this.props.route.params.profile.gender ?? '',
        description: this.props.route.params.profile.description ?? '',
        amount: this.props.route.params.profile.amount ?? '',
        selectedItems: this.props.route.params.profile.getSpecialtyJson ?? [],
        items: [],
        isCepSet: true,
        user: this.props.route.params.user,
        profile: this.props.route.params.profile,
        spinner: false
    }

    onSelectedItemsChange = (selectedItems) => {
        // Set Selected Items
        this.setState({ selectedItems, specialtyJson: selectedItems });
    };

    loadViaCep = async () => {
        try {
            if (this.state.cep === undefined) return;
            const response = await axios.get(`https://viacep.com.br/ws/${this.state.cep}/json/`);
            const location = response.data;
            // const filter = { ...this.state.filter, district: infos.bairro, cep: infos.cep, complement: infos.complemento, street: infos.logradouro, state: infos.uf
            //     , city: infos.localidade };
            console.log(location);
            this.setState({
                cep: location.cep,
                district: location.bairro,
                complement: location.complemento,
                street: location.logradouro,
                state: location.uf,
                city: location.localidade,
                isCepSet: true
            });
            this.setState({ spinner: false });

        } catch (error) {
            showError(error);
            this.setState({ spinner: false });
        }
    }

    loadSpeciality = async () => {
        try {
            const response = await api.get('/psychologist/getSpeciality');
            this.setState({ items: response.data });
        } catch (error) {
            showError(error);
        }
    }

    addPhoto = () => {
        const options = {
            title: 'Selecione uma imagem',
            takePhotoButtonTitle: 'Tirar uma Foto',
            chooseFromLibraryButtonTitle: 'Escolher da Galeria',
            quality: 1,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('ImagePicker Custom: ', response.error);
            } else {
                const { originalRotation, error } = response;

                let rotation = 0;

                if (response.uri && !error) {
                    rotation = 0;

                    if (originalRotation === 90) {
                        rotation = 90;
                    } else if (originalRotation === 270) {
                        rotation = -90;
                    }
                }
                this.setState({ spinner: true });
                ImageResizer.createResizedImage(
                    response.uri,
                    1280,
                    720,
                    'JPEG',
                    100,
                    rotation,
                ).then(({ uri }) => {
                    const uriResize = uri.replace('file://', '');
                    RNFetchBlob.fs.readFile(uriResize, 'base64').then(data => {
                        return RNFetchBlob.polyfill.Blob.build(data, {
                            type: 'image/jpeg;BASE64',
                        }).then(async blob => {
                            const fbImage = storage()
                                .ref()
                                .child(blob._ref);
                            try {
                                await fbImage.putFile(blob._ref, { contentType: 'image/jpeg' });
                                const url = await fbImage.getDownloadURL();
                                this.setState({ image: url })
                                console.log(url);
                                this.setState({ spinner: false });
                            } catch (err) {
                                console.log(err);
                                this.setState({ spinner: false });
                            }
                        });
                    });
                });
            }
        });
    }

    EditProfile = async () => {
        try {
            reactotron.log(this.state);
            const response = await api.put('/psychologist', {
                user: {
                    Id: this.state.user.id,
                    Name: this.state.name,
                    Image: this.state.image,
                    LastName: this.state.lastName,
                    Cpf: this.state.cpf,
                    Email: this.state.email,
                },
                psychologists: {
                    Id: this.state.profile.id,
                    CRM: this.state.crm,
                    SpecialtyJson: this.state.specialtyJson,
                    Cep: this.state.cep,
                    City: this.state.city,
                    State: this.state.state,
                    District: this.state.district,
                    Street: this.state.street,
                    Complement: this.state.complement,
                    Number: this.state.number,
                    Gender: parseInt(this.state.gender, 10),
                    Description: this.state.description,
                    Amount: this.state.amount,
                }


            });
            this.props.navigation.navigate('Profile');
            this.setState({ spinner: false });
        } catch (_err) {
            new showError(_err);
            this.setState({ spinner: false });
        }
    }

    UselessTextInput = (props) => {
        return (
            <TextInput
                {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                editable
                maxLength={1000}
            />
        );
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <ScrollView style={styles.scrollview}>
                    <View style={styles.form}>
                        {
                            this.state.image == '' ?
                                <Image source={require('../../../../assets/images/padrao.jpg')}
                                    style={styles.image} />
                                :
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: this.state.image,
                                    }}
                                />
                        }

                        <TouchableHighlight style={styles.touchButton} onPress={() => this.addPhoto()}>
                            <Icon style={styles.buttonText} name={'camera'} color={'#000000'} />
                        </TouchableHighlight>
                        <TextInput placeholder='E-mail' value={this.state.email}
                            style={styles.input} onChangeText={email => { this.setState({ email }) }}
                            autoCapitalize="none"
                            autoCorrect={false} />
                        <TextInput placeholder='Nome' value={this.state.name}
                            style={styles.input} onChangeText={name => { this.setState({ name }) }}
                            autoCapitalize="none"
                            autoCorrect={false} />
                        <TextInput placeholder='Sobrenome' value={this.state.lastName}
                            style={styles.input} onChangeText={lastName => { this.setState({ lastName }) }}
                            autoCapitalize="none"
                            autoCorrect={false} />
                        <TextInput placeholder='CPF' value={this.state.cpf}
                            style={styles.input} onChangeText={cpf => { this.setState({ cpf }) }}
                            autoCapitalize="none"
                            autoCorrect={false} />
                        <View style={{ flex: 1, width: '100%' }}>
                            <View style={styles2.container}>
                                <SectionedMultiSelect
                                    items={this.state.items}
                                    IconRenderer={MaterialIcon}
                                    uniqueKey="id"
                                    selectText="Selecione a especialidade"
                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                    selectedItems={this.state.selectedItems}
                                />
                            </View>
                            <DropDownPicker
                                items={[
                                    { label: 'Masculino', value: '1' },
                                    { label: 'Feminino', value: '2' },
                                ]}
                                placeholder="Selecione um gênero"
                                searchablePlaceholder="Search for an item"
                                searchablePlaceholderTextColor="gray"
                                containerStyle={{ height: 40, width: '100%', marginBottom: 20 }}
                                style={{ backgroundColor: '#fafafa', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                defaultValue={this.state.gender.toString()}
                                onChangeItem={value => {
                                    console.log(value);
                                    this.setState({ gender: value.value })
                                }}
                            />
                            < TextInput placeholder='CRM' value={this.state.crm}
                                style={styles.input} onChangeText={value => { this.setState({ crm: value }) }}
                                autoCapitalize="none"
                                autoCorrect={false} />
                            <View style={styles.inputCep}>
                                <TextInput placeholder='CEP' value={this.state.cep}
                                    style={styles.textInputCep} onChangeText={(value) => { this.setState({ cep: value }) }}
                                    autoCapitalize="none"
                                    autoCorrect={false} />
                                <TouchableHighlight style={styles.touchButtonCep} onPress={() => {
                                    this.setState({ spinner: true });
                                    this.loadViaCep();
                                }}>
                                    <Text style={styles.buttonTextCep}>Buscar</Text>
                                </TouchableHighlight>
                            </View>
                            {this.state.isCepSet &&
                                <View style={{ flex: 1, width: '100%' }}>
                                    <TextInput placeholder='Rua' value={this.state.street}
                                        style={styles.input} onChangeText={(value) => { this.setState({ street: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Cidade' value={this.state.city}
                                        style={styles.input} onChangeText={(value) => { this.setState({ city: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Estado' value={this.state.state}
                                        style={styles.input} onChangeText={(value) => { this.setState({ state: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Bairro' value={this.state.district}
                                        style={styles.input} onChangeText={(value) => { this.setState({ district: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Número' value={this.state.number}
                                        style={styles.input} onChangeText={(value) => { this.setState({ number: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Complemento' value={this.state.complement}
                                        style={styles.input} onChangeText={(value) => { this.setState({ complement: value }) }}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                </View>
                            }
                            <this.UselessTextInput
                                multiline
                                numberOfLines={10}
                                placeholder='Descrição' value={this.state.description}
                                style={styles.inputArea} onChangeText={description => { this.setState({ description }) }}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <this.UselessTextInput
                                multiline
                                numberOfLines={10}
                                placeholder='Planos' value={this.state.amount}
                                style={styles.inputArea} onChangeText={amount => { this.setState({ amount }) }}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <TouchableHighlight style={styles.saveButton} onPress={() => {
                            this.setState({ spinner: true });
                            this.EditProfile();
                        }}>
                            <Text style={styles.saveText}>Salvar</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
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


export default Edit;