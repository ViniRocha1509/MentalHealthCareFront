import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage from '@react-native-firebase/storage';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { showError } from '../../../common';
import {
    Image,
    Text,
    TextInput,
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import styles from './stylesEdit';
import api from '../../../services/api';
import reactotron from 'reactotron-react-native';
import Spinner from 'react-native-loading-spinner-overlay';

class Edit extends React.Component {
    componentDidMount() {
    }

    state = {
        email: this.props.route.params.user.email ?? '',
        image: this.props.route.params.user.image ?? '',
        name: this.props.route.params.user.name ?? '',
        lastName: this.props.route.params.user.lastName ?? '',
        cpf: this.props.route.params.user.cpf ?? '',
        user: this.props.route.params.user,
        spinner: false

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
            const response = await api.put('/patient', {

                Id: this.state.user.id,
                Name: this.state.name,
                Image: this.state.image,
                LastName: this.state.lastName,
                Cpf: this.state.cpf,
                Email: this.state.email,
            });
            this.props.navigation.navigate('Profile');
            this.setState({ spinner: false })
        } catch (_err) {
            showError(_err);
            this.setState({ spinner: false })
        }
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

export default Edit;