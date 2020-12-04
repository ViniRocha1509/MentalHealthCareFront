import React from 'react';
import { View, Text, FlatList, SafeAreaView, Image, TouchableHighlight } from 'react-native';
import { Rating } from 'react-native-ratings';
import { showError } from '../../../common';
import api from '../../../services/api';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';
import reactotron from 'reactotron-react-native';

class ListEmergency extends React.Component {
    state = {
        docs: [],
        psychologistInfo: {},
        onEndReachedCalledDuringMomentum: true,
        filter: { distance: 50 },
        isfilter: true,
        isCepSet: false,
        spinner: false,
        withResult: true
    }

    initialFilter = {
        page: 1,
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if (this.state.docs.length > 0) {
                this.setState({ isfilter: true, docs: [] });
            }

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
                        emergency: true,
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
                    reactotron.log(item);
                    this.handleButtonPress(item)

                }}>
                    <Text style={styles.buttonText}>Mensagem</Text>
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
            const response = await api.get(`/patient/GetOnlinePsychologist?`, config);
            const { docs, ...psychologistInfo } = response.data;
            this.setState({ docs: [...this.state.docs, ...docs], psychologistInfo, filter, withResult: docs.length > 0, spinner: false });
        } catch (error) {
            this.setState({ spinner: false });
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

    render() {
        return (
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
                </SafeAreaView >

                :
                this.state.withResult == false ?
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.noResult}>Nenhum Resultado encontrado</Text>
                    </SafeAreaView>
                    :
                    <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
        )
    }
};

export default ListEmergency;