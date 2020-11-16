import React from 'react';
import { showError } from '../../../common';
import {
    Text,
    TextInput,
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import styles from './styles';
import api from '../../../services/api';
import reactotron from 'reactotron-react-native';
import { Rating } from 'react-native-ratings';
import Spinner from 'react-native-loading-spinner-overlay';

class RatingSchedule extends React.Component {
    componentDidMount() {
    }

    state = {
        rating: 0,
        psychologistId: this.props.route.params.psychologistId ?? 0,
        scheduleId: this.props.route.params.scheduleId ?? 0,
        comment: '',
        spinner: false,
    }

    ratingPsychologist = async () => {
        try {
            const response = await api.post('/Rates', {
                PsychologistId: this.state.psychologistId,
                Avaliation: this.state.rating,
                Comment: this.state.comment,
                ScheduleId: this.state.scheduleId
            });
            this.props.navigation.navigate('Schedule');
            this.setState({spinner: false});
        } catch (_err) {
            showError(_err.response.data);
            this.setState({spinner: false});
        }
    }

    UselessTextInput = (props) => {
        return (
            <TextInput
                {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                editable
                maxLength={1000}
            />
        );
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
                        <View style={styles.rating}>
                            <Rating
                                startingValue={this.state.rating}
                                showRating={false}
                                imageSize={50}
                                onFinishRating={rating => { this.setState({ rating }); }}
                            />
                        </View>
                        <this.UselessTextInput
                            multiline
                            numberOfLines={10}
                            placeholder='Comentário' value={this.state.comment}
                            style={styles.inputArea} onChangeText={comment => { this.setState({ comment }) }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableHighlight style={styles.saveButton} onPress={() => {
                            this.setState({spinner: true});
                            this.ratingPsychologist();
                        }}>
                            <Text style={styles.saveText}>Avaliar</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default RatingSchedule;