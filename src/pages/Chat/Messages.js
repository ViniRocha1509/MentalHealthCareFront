import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { View } from 'react-native';
import Reactotron from 'reactotron-react-native';
import { useAuth } from '../../context/auth';

export default function Messages({ route }) {
    const { thread } = route.params
    const { user } = useAuth();


    useEffect(() => {

        const unsubscribeListener = firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    }

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.displayName
                        }
                    }

                    return data
                });

                firestore()
                    .collection('MESSAGE_THREADS')
                    .doc(thread._id)
                    .onSnapshot(querySnapshot => {
                        const count = (!querySnapshot || !querySnapshot._data) ? 0 : user.typeUser === 1 ? querySnapshot._data.countPatientMessages : querySnapshot._data.countPsychologistMessages ;
                        if (countMessages == 0)
                            setCountMessages(count ?? 0);
                    });

                setMessages(messages)
            });

        setVisible();

        return () => unsubscribeListener()
    }, [])

    const [messages, setMessages] = useState([]);
    const [countMessages, setCountMessages] = useState(0);


    async function setVisible() {
        if (user.typeUser === 1 && !thread._id == false) {
            await firestore()
                .collection('MESSAGE_THREADS')
                .doc(thread._id)
                .set(
                    {
                        countPsychologistMessages: 0,
                        psychologistShow: false,
                    },
                    { merge: true }
                );
        } else if (user.typeUser === 2 && !thread._id == false) {
            await firestore()
                .collection('MESSAGE_THREADS')
                .doc(thread._id)
                .set(
                    {
                        countPatientMessages: 0,
                        patientShow: false,
                    },
                    { merge: true }
                );
        }
    }

    async function handleSend(newMessage = []) {
        const text = newMessage[0].text;
        firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: user.id,
                    displayName: user.name
                }
            });
        await firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    },
                    psychologistShow: user.typeUser === 1 ? false : true,
                    patientShow: user.typeUser === 2 ? false : true,
                    countPatientMessages: user.typeUser === 1 ? countMessages + 1 : 0,
                    countPsychologistMessages: user.typeUser === 2 ? (countMessages + 1) : 0 
                },
                { merge: true }
            );
        setCountMessages(countMessages + 1);
        setMessages(GiftedChat.append(messages, newMessage))
    }

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={{
                    _id: user.id
                }}
            />
        </View>
    )
}