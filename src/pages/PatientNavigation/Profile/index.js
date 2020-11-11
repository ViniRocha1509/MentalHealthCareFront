import * as React from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import styles from './styles';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { showError } from '../../../common';
import api from '../../../services/api';
import { Rating } from 'react-native-ratings';
import { FloatingAction } from "react-native-floating-action";
import Spinner from 'react-native-loading-spinner-overlay';

class Profile extends React.Component {
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadPatient();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  state = {
    user: {},
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

  loadPatient = async () => {
    try {
      var storagedUser = await AsyncStorage.getItem('@MHC:user');
      let userLoged = JSON.parse(storagedUser);
      const response = await api.get(`/patient/profilePatient/${userLoged.id}`);
      const user = response.data;
      this.setState({ user });
    } catch (error) {
      showError(error.response.data);
    }
  }

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
      this.isEmpty(this.state.user) == false?
        <SafeAreaView style={styles.container}>
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
                <Text style={styles.crm}>Nome:</Text>
                <Text style={styles.name}>{this.state.user.name + " " + this.state.user.lastName}</Text>
                <Text style={styles.crm}>CPF:</Text>
                <Text style={styles.crmValue}>{this.state.user.cpf}</Text>
              </View>
            </View>
            <View style={styles.paramsPsy}>
              <Text style={styles.speciality}>Email: </Text>
              <Text style={styles.specialityValue}>{this.state.user.email}</Text>
            </View>
          </ScrollView>
          <FloatingAction
            actions={actionsEdit}
            color="#FC6663"
            overrideWithAction={true}
            onPressItem={() => {
              this.props.navigation.navigate('Edit', {
                user: this.state.user,
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