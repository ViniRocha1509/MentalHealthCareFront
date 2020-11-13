import * as React from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, TouchableHighlight } from 'react-native';
import styles from './styles';
import Reactotron from 'reactotron-react-native';
import { showError } from '../../../common';
import api from '../../../services/api';
import { Rating } from 'react-native-ratings';
import Spinner from 'react-native-loading-spinner-overlay';

class Profile extends React.Component {
  componentDidMount() {
    this.loadPsychologist();
  }

  state = {
    profile: {},
    user: {},
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
      var psychologistId = this.props.route.params.psychologistId;
      const response = await api.get(`/patient/profilePsychologist/${psychologistId}`);
      const { user, ...profile } = response.data;
      this.setState({ user, profile });
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
      this.isEmpty(this.state.user) == false ?
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
                <Text style={styles.name}>{this.state.user.name + " " + this.state.user.lastName}</Text>
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
              <TouchableHighlight style={styles.avaliationLink} onPress={() => {
                this.props.navigation.navigate("Avaliation", { psychologistId: this.state.profile.id })
              }}>
                <Text style={styles.avaliationLinkText}>Ver avaliações</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
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