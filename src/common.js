import {Alert, Platform} from 'react-native';

function showError(err){
    Alert.alert('Ops! Ocorreu um problema!', `Mensagem : ${err}`);
}

function showSucess(msg){
    Alert.alert('Sucesso', msg);
}

export { showError, showSucess};
