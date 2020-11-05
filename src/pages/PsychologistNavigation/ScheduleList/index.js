import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    TouchableHighlight,
    TextInput,
    Alert,
} from 'react-native';

import styles from './styles';
import { FloatingAction } from "react-native-floating-action";
import api from '../../../services/api';
import { showError, showSucess } from '../../../common';
import reactotron from 'reactotron-react-native';
import DropDownPicker from 'react-native-dropdown-picker';

class ScheduleList extends React.Component {
    componentDidMount() {
        this.loadScheduleList({});
    }
    state = {
        docs: [],
        scheduleInfo: {},
        filter: {},
        isfilter: true,
        selectedStatus: '',
    }


    initialFilter = {
        status: null,
        month: 0,
        hour: 0,
        day: 0,
    }


    RefuseAlert = (id) =>
        Alert.alert(
            "Deseja realmente cancelar este agendamento? ",
            '',
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancelar"
                },
                { text: "Confirmar", onPress: () => { this.cancelSchedule(id) }, }
            ],
            { cancelable: false }
        );

    ConfirmAlert = (id) =>
        Alert.alert(
            "Deseja realmente confirmar este agendamento? ",
            '',
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancelar"
                },
                { text: "Confirmar", onPress: () => { this.confirmSchedule(id) }, }
            ],
            { cancelable: false }
        );

    completeAlert = (id) =>
        Alert.alert(
            "Deseja realmente completar este agendamento? ",
            '',
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancelar"
                },
                { text: "Confirmar", onPress: () => { this.completeSchedule(id) }, }
            ],
            { cancelable: false }
        );

    loadScheduleList = async (filters) => {
        try {
            const filter = { ...this.state.filter, ...filters };
            if (filter.page === undefined)
                filter.page = 1
            let config = { params: { ...filter } };

            const response = await api.get(`/psychologist/CheckAppointment?`, config);
            const { docs, ...scheduleInfo } = response.data;
            this.setState({ docs: [...this.state.docs, ...docs], scheduleInfo })
        } catch (error) {
            showError(error.response.data);
        }
    }

    cancelSchedule = async (id) => {
        try {
            const response = await api.delete(`/Schedule/CancelSchedule/${id}`);
            this.setState({ isfilter: true, docs: [] });
            this.loadScheduleList(this.initialFilter);
            showSucess(response.data);

        } catch (error) {
            showError(error.response.data);
        }
    }

    confirmSchedule = async (id) => {
        try {
            const response = await api.put(`/Schedule/ConfirmSchedule/${id}`);
            this.setState({ isfilter: true, docs: [] });
            this.loadScheduleList(this.initialFilter);
            showSucess(response.data);

        } catch (error) {
            showError(error.response.data);
        }
    }

    completeSchedule = async (id) => {
        try {
            const response = await api.put(`/Schedule/CompleteSchedule/${id}`);
            this.setState({ isfilter: true, docs: [] });
            this.loadScheduleList(this.initialFilter);
            showSucess(response.data);

        } catch (error) {
            showError(error.response.data);
        }
    }

    loadMore = () => {
        const { scheduleInfo } = this.state;

        if (scheduleInfo.hasNextPage === false) return;
        const filters = {};
        filters.page = scheduleInfo.pageNumber + 1;

        this.loadScheduleList(filters);
    };

    loadListFilter = () => {
        const { filter } = this.state;
        filter.page = 1;
        const docs = [];
        this.setState({ docs, isfilter: true })
        this.loadScheduleList(filter);
    }

    cleatFilter = () => {
        this.setState({ isfilter: true, docs: [] });
        this.loadScheduleList(this.initialFilter);
    }

    renderItem = ({ item }) => {
        var dateSchedule = new Date(item.appointment);
        return (
            <View style={styles.listContainer}>
                <View style={styles.paramsSchedule}>
                    <Image source={require('../../../../assets/images/padrao.jpg')} resizeMode="contain"
                        style={styles.image} />
                    <View style={styles.paramsScheduleColum}>
                        <Text style={styles.schedule}>Data: {dateSchedule.getDate()}/{dateSchedule.getMonth() + 1}/{dateSchedule.getFullYear()}</Text>
                        <Text style={styles.schedule}>Horário: {dateSchedule.getHours()}:00</Text>
                        <Text style={item.status == 1 ? styles.statusCompleted : item.status == 2 ? styles.statusScheduled :
                            item.status == 3 ? styles.statusUnavailable : styles.statusWaiting}>Status: {item.statusDescription}</Text>
                        {item.patient != null ?
                            <Text style={styles.patientValue}>Paciente: {item.patient.name + " " + item.patient.lastName}</Text>
                            :
                            <Text />
                        }
                    </View>
                </View>
                {
                    item.status == 4 ?
                        <View style={styles.containerButton}>
                            <TouchableHighlight style={styles.buttonList} onPress={() => { this.ConfirmAlert(item.id) }}>
                                <Text style={styles.buttonText}>Agendar</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.buttonList} onPress={() => { this.RefuseAlert(item.id) }}>
                                <Text style={styles.buttonText}>Recusar</Text>
                            </TouchableHighlight>
                        </View>
                        :
                        item.status == 3 ?
                            <View style={styles.containerButton}>
                                <TouchableHighlight style={styles.buttonList} onPress={() => { this.RefuseAlert(item.id) }}>
                                    <Text style={styles.buttonText}>Disponibilizar</Text>
                                </TouchableHighlight>
                            </View>
                            : item.status == 2 ?
                                <View style={styles.containerButton}>
                                    <TouchableHighlight style={styles.buttonList} onPress={() => { this.completeAlert(item.id) }}>
                                        <Text style={styles.buttonText}>Finalizar</Text>
                                    </TouchableHighlight>
                                </View>
                                :
                                <View />
                }
            </View>
        )
    }

    handleMonthChange = (month) => {
        const filter = this.state.filter;
        filter.month = month;
        this.setState({ filter });
    };

    handleDayChange = (day) => {
        const filter = this.state.filter;
        filter.day = day;
        this.setState({ filter });
    };

    handleHourChange = (hour) => {
        const filter = this.state.filter;
        filter.hour = hour;
        this.setState({ filter });
    };

    handleStatusChange = (status) => {
        const filter = this.state.filter;
        filter.status = status;
        this.setState({ filter });
    };


    closeFilter = () => {
        this.setState({ isfilter: true });
    }

    openFilter = () => {
        this.setState({ isfilter: false });
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
        return (
            this.state.isfilter ?
                <SafeAreaView style={styles.container}>
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.state.docs}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderItem}
                        onEndReached={() => {
                            this.loadMore();
                        }}
                        onEndReachedThreshold={0.8}
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
                    <View style={styles.form}>
                        <TextInput placeholder='Mês' value={this.state.filter.month}
                            style={styles.inputTime} onChangeText={this.handleMonthChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <TextInput placeholder='Dia' value={this.state.filter.day}
                            style={styles.inputTime} onChangeText={this.handleDayChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <TextInput placeholder='Hora' value={this.state.filter.hour}
                            style={styles.inputTime} onChangeText={this.handleHourChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <DropDownPicker
                            items={[
                                { label: 'Finalizada', value: '1' },
                                { label: 'Agendada', value: '2' },
                                { label: 'Indiponível', value: '3' },
                                { label: 'Aguardando', value: '4' },
                            ]}
                            defaultValue={this.state.selectedStatus}
                            searchable={true}
                            placeholder="Status"
                            searchablePlaceholder="Search for an item"
                            searchablePlaceholderTextColor="gray"
                            containerStyle={{ height: 40, width: '100%', marginBottom: 20 }}
                            style={{ backgroundColor: '#fafafa', alignSelf: 'center', marginLeft: 20, marginRight: 20, marginTop: 10 }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa' }}
                            onChangeItem={value => {
                                this.handleStatusChange(value.value);
                                this.setState({ selectedStatus: value.value });
                            }}
                        />
                        <TouchableHighlight style={styles.touchButton} onPress={this.loadListFilter}>
                            <Text style={styles.buttonTextFilter}>Filtrar</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.clearLink} onPress={this.cleatFilter}>
                            <Text style={styles.clearUpLinkText}>Limpar filtros</Text>
                        </TouchableHighlight>
                    </View>
                    <FloatingAction
                        actions={actionsClose}
                        color="#FC6663"
                        overrideWithAction={true}
                        onPressItem={this.closeFilter}
                    />
                </SafeAreaView>
        );
    }
};
export default ScheduleList;