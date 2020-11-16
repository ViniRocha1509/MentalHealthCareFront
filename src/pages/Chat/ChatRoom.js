import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Separator from '../../components/Separator'
import { useAuth } from '../../context/auth';
import Reactotron from 'reactotron-react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ChatRoom({ navigation }) {
    const [threads, setThreads] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth();

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('MESSAGE_THREADS')
            .orderBy('latestMessage.createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const threads = querySnapshot.docs.map(documentSnapshot => {
                    if (documentSnapshot.data().recipient == user.id || documentSnapshot.data().sender == user.id) {
                        return {
                            _id: documentSnapshot.id,
                            name: '',
                            latestMessage: { text: '' },
                            ...documentSnapshot.data()
                        }
                    }
                    return;
                });
                const finalThreads = threads.filter(function (item) {
                    return typeof item !== 'undefined';
                });
                setThreads(finalThreads)
                if (loading) {
                    setLoading(false)
                }
            })

        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='#555' />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            { threads.length > 0 ?
                < FlatList
                    data={threads}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Messages', { thread: item })}>
                            <View style={styles.listContainer}>
                                <View style={styles.content}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flexDirection: "column", flex: 1 }}>
                                            <View style={styles.header}>
                                                <Text style={styles.nameText}>{user.typeUser === 1 ? item.nameUser : item.name}</Text>
                                            </View>
                                            <Text style={styles.contentText}>
                                                {item.latestMessage.text.slice(0, 90)}
                                            </Text>
                                        </View>

                                        {
                                            item.patientShow === true && user.typeUser === 2 &&
                                            <View>
                                                {/* <Icon name={"eye"} size={22} style={{ alignSelf: "flex-end", justifyContent: "center" }} /> */}
                                                <View style={styles.coutMessage}><Text style={styles.textCountMessage}>{item.countPatientMessages}</Text></View>
                                            </View>
                                        }
                                        {
                                            item.psychologistShow === true && user.typeUser === 1 &&
                                            <View>
                                                {/* <Icon name={"eye"} size={22} style={{ alignSelf: "flex-end", justifyContent: "center" }} /> */}
                                                <View style={styles.coutMessage}><Text style={styles.textCountMessage}>{item.countPsychologistMessages}</Text></View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <Separator />}
                />
                :
                <SafeAreaView style={styles.container}>
                    <Text style={styles.noResult}>Nenhum Resultado encontrado</Text>
                </SafeAreaView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        height: "100%"
    },
    textCountMessage: {
        fontWeight: "bold",
        fontSize: 12
    },
    coutMessage: {
        marginTop: "50%",
        alignSelf: "flex-end",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#FC6663",
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        alignItems: "center"
    },
    listContainer: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 20,
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: '500'
    },
    row: {
        paddingRight: 10,
        paddingLeft: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        flexShrink: 1
    },
    header: {
        flexDirection: 'row'
    },
    nameText: {
        fontWeight: '600',
        fontSize: 18,
        color: '#000'
    },
    dateText: {},
    contentText: {
        color: '#949494',
        fontSize: 16,
        marginTop: 2
    },
    noResult: {
        alignSelf: "center",
        marginTop: "50%",
        fontWeight: "bold",
        fontSize: 16
    }
})