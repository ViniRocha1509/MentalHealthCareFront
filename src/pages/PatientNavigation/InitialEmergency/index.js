import * as React from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import styles from './styles';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { showError } from '../../../common';
import api from '../../../services/api';
import { Rating } from 'react-native-ratings';
import { FloatingAction } from "react-native-floating-action";
import Spinner from 'react-native-loading-spinner-overlay';

class InitialEmergency extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textInfo}>Está função é para usuário com necessidade de atendimento imediato. O paciente terá auxílio de um psicólogo online para atendê-lo,
        o uso indevido pode gerar punições.Pressione o botão para visualizar os psicólogos online.
          </Text>
        <TouchableHighlight style={styles.touchButton} onPress={() => { this.props.navigation.navigate('Emergency') }}>
          <Text style={styles.buttonText}>Preciso de ajuda</Text>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

export default InitialEmergency;