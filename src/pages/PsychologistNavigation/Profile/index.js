import * as React from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, Switch, Alert } from 'react-native';
import styles from './styles';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { showError, showSucess } from '../../../common';
import api from '../../../services/api';
import { Rating } from 'react-native-ratings';
import { FloatingAction } from "react-native-floating-action";
import reactotron from 'reactotron-react-native';
import Spinner from 'react-native-loading-spinner-overlay';

class Profile extends React.Component {
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadPsychologist();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  state = {
    profile: {},
    user: {},
    isOnline: false
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  loadPsychologist = async () => {
    try {
      var storagedUser = await AsyncStorage.getItem('@MHC:user');
      let userLoged = JSON.parse(storagedUser);
      const response = await api.get(`/psychologist/profileByUser/${userLoged.id}`);
      const { user, online, ...profile } = response.data;
      this.setState({ user, profile, isOnline: online });
    } catch (error) {
      showError(error.response.data);
    }
  }

  stayOnline = async (isOnline) => {
    try {
      const response = await api.post(`/psychologist/stayOnline`);
      this.setState({ spinner: false, isOnline });
    } catch (error) {
      showError(error);
      this.setState({ spinner: false });
    }
  }

  isOnlineAlert = (isOnline) =>
    Alert.alert(
      `Deseja ficar ${isOnline ? "Online" : "Offline"}? `,
      (isOnline ? 'Está opção permitirá que você seja listado nas opções de psicologos disponiveis para uma emergencia. Para auxiliar alguém com uma necessidade.' : ''),
      [
        {
          text: "Cancelar",
          onPress: () => { },
          style: "cancelar"
        },
        {
          text: "Confirmar", onPress: () => {
            this.setState({ spinner: true });
            this.stayOnline(isOnline);
          },
        }
      ],
      { cancelable: false }
    );

  render() {
    const actionsEdit = [
      {
        text: "Close",
        icon: require("../../../../assets/edit.png"),
        name: "bt_close",
        position: 1
      },
    ];
    return (
      this.isEmpty(this.state.user) == false ?
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ScrollView style={styles.scrollview}>
            <View style={styles.paramsUser}>
              {
                !this.state.user.image ?
                  <Image source={require('../../../../assets/images/padrao.jpg')}
                    style={styles.image} />
                  :
                  <Image
                    style={styles.image}
                    source={{
                      uri: this.state.user.image,
                    }}
                  />
              }


              <View style={styles.paramsPsyColum}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <Text style={styles.name}>{this.state.user.name + " " + this.state.user.lastName}</Text>
                  <Switch
                    style={{ marginLeft: 10 }}
                    trackColor={{ false: "#767577", true: "#00ff00" }}
                    thumbColor={this.state.isOnline ? "#32cd32" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={value => {
                      this.isOnlineAlert(value);
                    }}
                    value={this.state.isOnline}
                  />
                </View>
                <Text style={styles.crm}>Status da conta:</Text>
                <Text style={this.state.profile.confirmCrm == 1 ? styles.statusApproved :
                  this.state.profile.confirmCrm == 2 ? styles.statusDisapproved : styles.statusWaiting}>{this.state.profile.crmConfirmDescrition}</Text>
                <Text style={styles.crm}>CRM:</Text>
                <Text style={styles.crmValue}>{this.state.profile.crm}</Text>
                <View style={styles.rating}>
                  <Rating
                    startingValue={this.state.profile.rating}
                    showRating={false}
                    imageSize={25}
                    readonly={true}
                  />
                </View>
              </View>
            </View>
            <View style={styles.paramsPsy}>
              <Text style={styles.speciality}>Especialidade: </Text>
              <Text style={styles.specialityValue}>{this.state.profile.specialtyDescrition}</Text>
              <Text style={styles.adress}>Localização: </Text>
              <Text style={styles.adressValue}>{this.state.profile.fullAdress}</Text>
              <Text style={styles.description}>Descrição: </Text>
              <Text style={styles.descriptionValue}>{this.state.profile.description ?? "Psicologo não possui uma descrição"}</Text>
              <Text style={styles.description}>Plano: </Text>
              <Text style={styles.descriptionValue}>{this.state.profile.amount ?? "Psicologo não possui um plano"}</Text>
            </View>
          </ScrollView>
          <FloatingAction
            actions={actionsEdit}
            color="#FC6663"
            overrideWithAction={true}
            onPressItem={() => {
              this.props.navigation.navigate('Edit', {
                user: this.state.user,
                profile: this.state.profile
              })
            }}
          />
        </SafeAreaView>
        :
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
    );
  }
}

export default Profile;