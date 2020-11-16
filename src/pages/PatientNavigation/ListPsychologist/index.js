import React from 'react';
import { View, Text, FlatList, SafeAreaView, Image, TouchableHighlight, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Rating } from 'react-native-ratings';
import { showError } from '../../../common';
import api from '../../../services/api';
import styles from './styles';
import { FloatingAction } from "react-native-floating-action";
import Slider from '@react-native-community/slider';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker'
import Spinner from 'react-native-loading-spinner-overlay';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import reactotron from 'reactotron-react-native';

class ListPsychologist extends React.Component {
    state = {
        docs: [],
        psychologistInfo: {},
        onEndReachedCalledDuringMomentum: true,
        filter: { distance: 50 },
        isfilter: true,
        isCepSet: false,
        spinner: false,
        withResult: true,
        threads: [],
        loadSpinner: true,
    }

    initialFilter = {
        distance: 50,
        page: 1,
        cep: '',
        street: '',
        city: '',
        state: '',
        number: '',
        gender: undefined,
        rating: 0,
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ isfilter: true, docs: [] });
            this.loadPsychologist(this.initialFilter);
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    handleButtonPress = async (psychologist) => {
        var isExist = false;
        var existUser = firestore().collection("MESSAGE_THREADS");
        var chat = {};
        await existUser.where("sender", "==", psychologist.user.id).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    if (doc.data().sender == psychologist.user.id) {
                        isExist = true;
                        chat = {
                            _id: doc.id,
                            name: '',
                            latestMessage: { text: '' },
                            ...doc.data()
                        }
                    }
                });
            });

        if (isExist == false) {
            var user = await AsyncStorage.getItem('@MHC:user');
            let userLoged = JSON.parse(user);
            if (this.isEmpty(psychologist) == false) {
                // create new thread using firebase & firestore
                firestore()
                    .collection('MESSAGE_THREADS')
                    .add({
                        name: psychologist.user.name + " " + psychologist.user.lastName,
                        nameUser: userLoged.name + " " + userLoged.lastName,
                        emergency: false,
                        recipient: userLoged.id,
                        sender: psychologist.user.id,
                        patientUser: userLoged.id,
                        latestMessage: {
                            text: `${psychologist.user.name} created. Welcome!`,
                            createdAt: new Date().getTime()
                        }
                    })
                    .then(docRef => {
                        docRef.collection('MESSAGES').add({
                            text: `${psychologist.user.name} created. Welcome!`,
                            createdAt: new Date().getTime(),
                            system: true
                        })
                    });

                var chatCreated = firestore().collection("MESSAGE_THREADS");
                var newChat = {};
                await chatCreated.where("sender", "==", psychologist.user.id).get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            if (doc.data().sender == psychologist.user.id) {
                                isExist = true;
                                newChat = {
                                    _id: doc.id,
                                    name: '',
                                    latestMessage: { text: '' },
                                    ...doc.data()
                                }
                            }
                        });
                    });
                this.props.navigation.navigate('Messages', { thread: newChat })
            }
        } else {
            this.props.navigation.navigate('Messages', { thread: chat })
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.listContainer}>
            <View style={styles.paramsPsy}>
                {
                    !item.user.image ?
                        <Image source={require('../../../../assets/images/padrao.jpg')}
                            style={styles.image} />
                        :
                        <Image
                            style={styles.image}
                            source={{
                                uri: item.user.image,
                            }}
                        />
                }
                <View style={styles.paramsPsyColum}>
                    <Text style={styles.name}>{item.user.name + " " + item.user.lastName}</Text>
                    <Text style={styles.crm}>CRM:</Text>
                    <Text style={styles.crmValue}>{item.crm}</Text>
                    <View style={styles.rating}>
                        <Rating
                            startingValue={item.rating}
                            showRating={false}
                            imageSize={25}
                            readonly={true}
                        />
                    </View>
                </View>
            </View>
            <Text style={styles.speciality}>Especialidade: </Text>
            <Text style={styles.specialityValue}>{item.specialtyDescrition}</Text>
            <Text style={styles.adress}>Localização: </Text>
            <Text style={styles.adressValue}>{item.fullAdress}</Text>
            <View style={styles.containerButton}>
                <TouchableHighlight style={styles.buttonList} onPress={() => {
                    this.props.navigation.navigate('Schedule', {
                        psychologistId: item.id
                    });
                }}>
                    <Text style={styles.buttonText}>Agendar</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonList} onPress={() => { this.handleButtonPress(item) }}>
                    <Text style={styles.buttonText}>Mensagem</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonList} onPress={() => {
                    this.props.navigation.navigate('ProfilePsychologist', {
                        psychologistId: item.id
                    });
                }}>
                    <Text style={styles.buttonText}>Pefil</Text>
                </TouchableHighlight>
            </View>
        </View>
    )

    loadPsychologist = async (filters) => {
        try {
            const filter = { ...this.state.filter, ...filters };
            if (filter.page === undefined)
                filter.page = 1
            let config = { params: { ...filter } };
            const response = await api.get(`/patient/FindPsychologists?`, config);
            const { docs, ...psychologistInfo } = response.data;
            this.setState({ docs: [...this.state.docs, ...docs], psychologistInfo, filter, withResult: docs.length > 0, spinner: false });
        } catch (error) {
            this.setState({ spinner: false });
            showError(error.response.data);
        }
    }

    loadViaCep = async () => {
        try {
            if (this.state.filter.cep === undefined) return;
            const response = await axios.get(`https://viacep.com.br/ws/${this.state.filter.cep}/json/`);
            const { ...infos } = response.data;
            const filter = { ...this.state.filter, district: infos.bairro, cep: infos.cep, complement: infos.complemento, street: infos.logradouro, state: infos.uf, city: infos.localidade };
            this.setState({ filter, isCepSet: true })
        } catch (error) {
            showError(error.response.data);
        }
    }

    loadMore = () => {
        const { psychologistInfo } = this.state;

        if (psychologistInfo.hasNextPage === false) {
            this.setState({ spinner: false })
            return;
        }
        const filters = {};
        filters.page = psychologistInfo.pageNumber + 1;
        this.loadPsychologist(filters);
    };

    handleCepChange = (cep) => {
        const filter = this.state.filter;
        filter.cep = cep;
        this.setState({ filter });
    };

    handleStreetChange = (street) => {
        const filter = this.state.filter;
        filter.street = street;
        this.setState({ filter });
    };

    handleDistrictChange = (district) => {
        const filter = this.state.filter;
        filter.district = district;
        this.setState({ filter });
    };

    handleCityChange = (city) => {
        const filter = this.state.filter;
        filter.city = city;
        this.setState({ filter });
    };

    handleStateChange = (state) => {
        const filter = this.state.filter;
        filter.state = state;
        this.setState({ filter });
    };

    handleComplementChange = (complement) => {
        const filter = this.state.filter;
        filter.complement = complement;
        this.setState({ filter });
    };

    handleNumberChange = (number) => {
        const filter = this.state.filter;
        filter.number = number;
        this.setState({ filter });
    };

    handleDistanceChange = (distance) => {
        const filter = this.state.filter;
        filter.distance = Math.round(distance ?? 0);
        this.setState({ filter });
    };

    handleRatingChange = (rating) => {
        const filter = this.state.filter;
        filter.rating = rating;
        this.setState({ filter });
    };

    handleGenderChange = (gender) => {
        const filter = this.state.filter;
        const { value } = gender;
        filter.gender = parseInt(value);
        this.setState({ filter });
    };

    loadListFilter = () => {
        const { filter } = this.state;
        filter.distance = filter.distance ?? 50;
        filter.page = 1;
        const docs = [];
        this.setState({ docs, isfilter: true })
        this.loadPsychologist(filter);
    }

    openFilter = () => {
        this.setState({ isfilter: false });
    }

    closeFilter = () => {
        this.setState({ isfilter: true });
    }

    clearFilter = () => {
        this.setState({ isfilter: true, docs: [], isCepSet: false, withResult: true });
        this.loadPsychologist(this.initialFilter);
    }

    render() {
        const actionsFilter = [
            {
                text: "Filter",
                icon: require("../../../../assets/Filter-2-icon.png"),
                name: "bt_filter",
                position: 1,
            },
        ];
        const actionsClose = [
            {
                text: "Close",
                icon: require("../../../../assets/close.png"),
                name: "bt_close",
                position: 1
            },
        ];
        const data = [
            {
                label: 'data 1'
            },
            {
                label: 'data 2'
            }
        ];
        const { navigation } = this.props;
        return (
            this.state.isfilter ?
                this.state.docs.length > 0 ?

                    <SafeAreaView style={styles.container}>
                        <Spinner
                            visible={this.state.spinner}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                        <FlatList
                            contentContainerStyle={styles.list}
                            data={this.state.docs}
                            keyExtractor={item => item.id.toString()}
                            renderItem={this.renderItem}
                            onEndReached={() => {
                                if (!this.state.onEndReachedCalledDuringMomentum) {
                                    this.setState({ spinner: true });
                                    this.loadMore();
                                    this.state.onEndReachedCalledDuringMomentum = true;
                                }
                            }}
                            onEndReachedThreshold={0.4}
                            onMomentumScrollBegin={() => {
                                this.state.onEndReachedCalledDuringMomentum = false;
                            }}
                        />
                        <FloatingAction
                            actions={actionsFilter}
                            color="#FC6663"
                            overrideWithAction={true}
                            onPressItem={this.openFilter}
                        />
                    </SafeAreaView >

                    :
                    this.state.withResult == false ?
                        <SafeAreaView style={styles.container}>
                            <Text style={styles.noResult}>Nenhum Resultado encontrado</Text>
                            <FloatingAction
                                actions={actionsFilter}
                                color="#FC6663"
                                overrideWithAction={true}
                                onPressItem={this.openFilter}
                            />
                        </SafeAreaView>
                        :
                        <Spinner
                            visible={true}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                :
                <SafeAreaView style={styles.container}>
                    <ScrollView style={styles.scrollview}>
                        <View style={styles.form}>
                            <View style={styles.inputCep}>
                                <TextInput placeholder='CEP' value={this.state.filter.cep}
                                    style={styles.input} onChangeText={this.handleCepChange}
                                    autoCapitalize="none"
                                    autoCorrect={false} />
                                <TouchableHighlight style={styles.touchButtonCep} onPress={this.loadViaCep}>
                                    <Text style={styles.buttonTextCep}>Buscar</Text>
                                </TouchableHighlight>

                            </View>
                            {this.state.isCepSet &&
                                <View>
                                    <TextInput placeholder='Rua' value={this.state.filter.street}
                                        style={styles.inputAdress} onChangeText={this.handleStreetChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Cidade' value={this.state.filter.city}
                                        style={styles.inputAdress} onChangeText={this.handleCityChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Estado' value={this.state.filter.state}
                                        style={styles.inputAdress} onChangeText={this.handleStateChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Bairro' value={this.state.filter.district}
                                        style={styles.inputAdress} onChangeText={this.handleDistrictChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Número' value={this.state.filter.number}
                                        style={styles.inputAdress} onChangeText={this.handleNumberChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <TextInput placeholder='Complemento' value={this.state.filter.complement}
                                        style={styles.inputAdress} onChangeText={this.handleComplementChange}
                                        autoCapitalize="none"
                                        autoCorrect={false} />
                                    <View style={styles.inputSlider}>
                                        <Slider
                                            style={{ width: 300, height: 40 }}
                                            minimumValue={0}
                                            maximumValue={100}
                                            minimumTrackTintColor="#FC6663"
                                            maximumTrackTintColor="#000000"
                                            value={this.state.filter.distance ?? 50}
                                            onValueChange={this.handleDistanceChange}
                                        />
                                        <Text>{Math.round(this.state.filter.distance ?? 50)} KM</Text>
                                    </View>
                                </View>
                            }
                            <View style={styles.rating}>
                                <DropDownPicker
                                    items={[
                                        { label: 'Masculino', value: '1' },
                                        { label: 'Feminino', value: '2' },
                                    ]}
                                    searchable={true}
                                    placeholder="Selecione um gênero"
                                    searchablePlaceholder="Search for an item"
                                    searchablePlaceholderTextColor="gray"
                                    containerStyle={{ height: 40, width: '90%', marginBottom: 20 }}
                                    style={{ backgroundColor: '#fafafa', alignSelf: 'center' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={this.handleGenderChange}
                                />
                                <Text>Avaliação:</Text>
                                <Rating
                                    startingValue={this.state.filter.rating ?? 0}
                                    showRating={false}
                                    imageSize={25}
                                    onFinishRating={this.handleRatingChange}
                                />
                            </View>

                            <TouchableHighlight style={styles.touchButton} onPress={this.loadListFilter}>
                                <Text style={styles.buttonTextFilter}>Filtrar</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.signUpLink} onPress={this.clearFilter}>
                                <Text style={styles.signUpLinkText}>Limpar filtros</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    <FloatingAction
                        actions={actionsClose}
                        color="#FC6663"
                        overrideWithAction={this.state.loadSpinner}
                        onPressItem={this.closeFilter}
                    />
                </SafeAreaView >
        )
    }
};


export default ListPsychologist;