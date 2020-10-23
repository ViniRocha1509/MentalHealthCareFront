import React from 'react';
import { View, Text, FlatList, SafeAreaView, Image, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { Rating } from 'react-native-ratings';
import { showError } from '../../common';
import api from '../../services/api';
import styles from './styles';
import { FloatingAction } from "react-native-floating-action";
import Slider from '@react-native-community/slider';
import axios from 'axios';
import Reactotron from 'reactotron-react-native';
import DropDownPicker from 'react-native-dropdown-picker'

class ListPsychologist extends React.Component {
    componentDidMount() {
        this.loadPsychologist({});
    }

    state = {
        docs: [],
        psychologistInfo: {},
        onEndReachedCalledDuringMomentum: true,
        filter: { distance: 50 },
        isfilter: false,
        isCepSet: false,
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
    renderItem = ({ item }) => (
        <View style={styles.listContainer}>
            <View style={styles.paramsPsy}>
                <Image source={require('../../../assets/images/padrao.jpg')} resizeMode="contain"
                    style={styles.image} />
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
                <TouchableHighlight style={styles.buttonList} onPress={() => { }}>
                    <Text style={styles.buttonText}>Mensagem</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonList} onPress={() => { }}>
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
            this.setState({ docs: [...this.state.docs, ...docs], psychologistInfo, filter })
        } catch (error) {
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

        if (psychologistInfo.hasNextPage === false) return;
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

    cleatFilter = () => {
        this.setState({ isfilter: true, docs: [], isCepSet: false });
        this.loadPsychologist(this.initialFilter);
    }

    render() {
        const actionsFilter = [
            {
                text: "Filter",
                icon: require("../../../assets/Filter-2-icon.png"),
                name: "bt_filter",
                position: 1,
            },
        ];
        const actionsClose = [
            {
                text: "Close",
                icon: require("../../../assets/close.png"),
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
                <SafeAreaView style={styles.container}>
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.state.docs}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderItem}
                        onEndReached={() => {
                            if (!this.state.onEndReachedCalledDuringMomentum) {
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
                            <TouchableHighlight style={styles.signUpLink} onPress={this.cleatFilter}>
                                <Text style={styles.signUpLinkText}>Limpar filtros</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    <FloatingAction
                        actions={actionsClose}
                        color="#FC6663"
                        overrideWithAction={true}
                        onPressItem={this.closeFilter}
                    />
                </SafeAreaView >
        )
    }
};


export default ListPsychologist;