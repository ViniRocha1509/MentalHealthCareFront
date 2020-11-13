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
import Spinner from 'react-native-loading-spinner-overlay';
import { Rating } from 'react-native-ratings';

class MyAvaliations extends React.Component {
    state = {
        docs: [],
        rateInfo: {},
        filter: {},
        isfilter: true,
        spinner: false,
        withResult: true
    }


    initialFilter = {
        page: 1,
        avaliation: 0
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ isfilter: true, docs: [] });
            this.loadAvaliations(this.initialFilter);
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    loadAvaliations = async (filters) => {
        try {
            const filter = { ...this.state.filter, ...filters };
            if (filter.page === undefined)
                filter.page = 1
            let config = { params: { ...filter } };

            const response = await api.get(`/psychologist/ViewRatings?`, config);
            const { docs, ...rateInfo } = response.data;
            this.setState({ docs: [...this.state.docs, ...docs], filter, rateInfo, withResult: docs.length > 0, spinner: false })
        } catch (error) {
            this.setState({ spinner: false });
            showError(error.response.data);
        }
    }

    loadMore = () => {
        const { rateInfo } = this.state;

        if (rateInfo.hasNextPage === false) {
            this.setState({ spinner: false })
            return;
        }
        const filters = {};
        filters.page = rateInfo.pageNumber + 1;

        this.loadAvaliations(filters);
    };

    loadListFilter = () => {
        const { filter } = this.state;
        filter.page = 1;
        const docs = [];
        this.setState({ docs, isfilter: true })
        this.loadAvaliations(filter);
    }

    clearFilter = () => {
        this.setState({ isfilter: true, docs: [], withResult: true });
        this.loadAvaliations(this.initialFilter);
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.listContainer}>
                <View style={styles.paramsAvaliation}>
                    <View style={styles.rating}>
                        <Text style={styles.avaliation}>Avaliação</Text>
                        <Rating
                            startingValue={item.avaliation}
                            showRating={false}
                            imageSize={25}
                            readonly={true}
                        />
                        <Text style={styles.avaliation}>Comentário:</Text>
                    </View>
                    <View style={styles.avaliationBox}>
                        <Text style={styles.avaliation}>{item.comment}</Text>
                    </View>
                </View>
            </View>
        )
    }

    handleRatingChange = (rating) => {
        const filter = this.state.filter;
        filter.avaliation = rating;
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
                        <View style={styles.rating}>
                            <Text>Avaliação:</Text>
                            <Rating
                                startingValue={this.state.filter.avaliation ?? 0}
                                showRating={false}
                                imageSize={25}
                                onFinishRating={this.handleRatingChange}
                            />
                        </View>
                        <TouchableHighlight style={styles.touchButton} onPress={this.loadListFilter}>
                            <Text style={styles.buttonTextFilter}>Filtrar</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.clearLink} onPress={() => {
                            this.clearFilter()
                        }}>
                            <Text style={styles.clearLinkText}>Limpar filtros</Text>
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
export default MyAvaliations;