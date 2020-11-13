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
import Spinner from 'react-native-loading-spinner-overlay';

class ScheduleList extends React.Component {
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ isfilter: true, docs: [] });
            this.loadScheduleList(this.initialFilter);
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }
    state = {
        docs: [],
        scheduleInfo: {},
        filter: {},
        isfilter: true,
        selectedStatus: '',
        spinner: false,
        withResult: true
    }


    initialFilter = {
        status: null,
        page: 1,
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


    loadScheduleList = async (filters) => {
        try {
            const filter = { ...this.state.filter, ...filters };
            if (filter.page === undefined)
                filter.page = 1
            let config = { params: { ...filter } };

            const response = await api.get(`/patient/CheckAppointment?`, config);
            const { docs, ...scheduleInfo } = response.data;
            this.setState({ docs: [...this.state.docs, ...docs], scheduleInfo, filter, withResult: docs.length > 0, spinner: false })
        } catch (error) {
            this.setState({ spinner: false });
            showError(error.response.data);
        }
    }

    cancelSchedule = async (id) => {
        try {
            const response = await api.put(`/Schedule/RefusedSchedule/${id}`);
            this.setState({ isfilter: true, docs: [] });
            this.loadScheduleList(this.initialFilter);
            showSucess(response.data);
        } catch (error) {
            showError(error.response.data);
        }
    }

    loadMore = () => {
        const { scheduleInfo } = this.state;

        if (scheduleInfo.hasNextPage === false) {
            this.setState({ spinner: false })
            return;
        }
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

    clearFilter = () => {
        this.setState({ isfilter: true, docs: [], withResult: true });
        this.loadScheduleList(this.initialFilter);
    }

    renderItem = ({ item }) => {
        var dateSchedule = new Date(item.appointment);
        return (
            <View style={styles.listContainer}>
                <View style={styles.paramsSchedule}>
                    {
                        !item.psychologist.user.image ?
                            <Image source={require('../../../../assets/images/padrao.jpg')}
                                style={styles.image} />
                            :
                            <Image
                                style={styles.image}
                                source={{
                                    uri: item.psychologist.user.image,
                                }}
                            />
                    }
                    <View style={styles.paramsScheduleColum}>
                        {item.psychologist != null ?
                            <View>
                                <Text style={styles.name}>{item.psychologist.user.name + " " + item.psychologist.user.lastName}</Text>
                                <Text style={styles.crm}>CRM:</Text>
                                <Text style={styles.crmValue}>{item.psychologist.crm}</Text>
                            </View>
                            :
                            <Text />
                        }
                    </View>
                </View>
                <Text style={styles.adress}>Localização: </Text>
                <Text style={styles.adressValue}>{`${item.psychologist.street},${item.psychologist.number} - ${item.psychologist.district}, ${item.psychologist.city} - ${item.psychologist.state}`}</Text>
                <View style={styles.appointment}>
                    <Text style={styles.date}>Data: <Text style={styles.dateValue}>{dateSchedule.getUTCDate()}/{dateSchedule.getUTCMonth() + 1}/{dateSchedule.getFullYear()}</Text></Text>
                    <Text style={styles.time}>Horário: <Text style={styles.timeValue}>{dateSchedule.getUTCHours()}:00</Text></Text>
                </View>
                <Text style={item.status == 1 ? styles.statusCompleted : item.status == 2 ? styles.statusRefused :
                    styles.statusScheduled}>Status: {item.statusDescription}</Text>
                {
                    item.status == 5 ?
                        <View style={styles.containerButton}>
                            <TouchableHighlight style={styles.buttonList} onPress={() => { this.RefuseAlert(item.id) }}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableHighlight>
                        </View>
                        :
                        <View />
                }
                {
                    item.status == 1 && item.isRating === false ?
                        <View style={styles.containerButton}>
                            <TouchableHighlight style={styles.buttonList} onPress={() => {
                                this.props.navigation.navigate('Rates', {
                                    psychologistId: item.psychologistId,
                                    scheduleId: item.id
                                });
                            }}>
                                <Text style={styles.buttonText}>Avaliar</Text>
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
                                this.setState({ spinner: true });
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
                    <View style={styles.form}>
                        <TextInput placeholder='Mês' value={this.state.filter.month == 0 ? "" : this.state.filter.month}
                            style={styles.inputTime} onChangeText={this.handleMonthChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <TextInput placeholder='Dia' value={this.state.filter.day == 0 ? "" : this.state.filter.day}
                            style={styles.inputTime} onChangeText={this.handleDayChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <TextInput placeholder='Hora' value={this.state.filter.hour == 0 ? "" : this.state.filter.hour}
                            style={styles.inputTime} onChangeText={this.handleHourChange}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            autoCorrect={false} />
                        <DropDownPicker
                            items={[
                                { label: 'Finalizada', value: '1' },
                                { label: 'Recusado', value: '2' },
                                { label: 'Agendado', value: '3' },
                                { label: 'Indiponível', value: '4' },
                                { label: 'Aguardando', value: '5' },
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
                        <TouchableHighlight style={styles.clearLink} onPress={() => {
                            this.clearFilter()
                        }}>
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