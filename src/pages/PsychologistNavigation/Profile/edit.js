import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage from '@react-native-firebase/storage';
import React, { useState } from 'react';
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
    Button,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


class Edit extends React.Component {
    state = {
        imgUrl: ''
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
                                console.log(url);
                            } catch (err) {
                                console.log(err);
                            }
                        });
                    });
                });
            }
        });
    }


    render() {
        return (
            <SafeAreaView>
                <Text>Editar!</Text>
                <TouchableHighlight onPress={() => { this.addPhoto() }}><Text>Botão</Text></TouchableHighlight>
            </SafeAreaView>
        );
    }
}


export default Edit;