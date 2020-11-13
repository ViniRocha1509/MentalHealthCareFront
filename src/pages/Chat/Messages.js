import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
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
                })

                setMessages(messages)
            })

        return () => unsubscribeListener()
    }, [])

    const [messages, setMessages] = useState([])

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
                    }
                },
                { merge: true }
            );

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