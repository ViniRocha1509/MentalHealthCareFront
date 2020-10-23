import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
import { showError } from '../common';
import Reactotron from 'reactotron-react-native';

const AuthContextData = {};
const AuthContext = createContext(AuthContextData);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(null);
    const [created, setcreated] = useState(null);

    useEffect(() => {
        async function loadStoragedData() {
            const storagedUser = await AsyncStorage.getItem('@MHC:user');
            const storagedToken = await AsyncStorage.getItem('@MHC:token');
            const storagedSingned = await AsyncStorage.getItem('@MHC:singned');

            if (storagedUser && storagedToken) {
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
                setSigned(storagedSingned !== null ? JSON.parse(storagedSingned) : new Boolean());
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        }
        loadStoragedData();
    }, []);

    // async function signIn() {
    //     const response = await auth.signIn();

    //     setUser(response.user)

    //     api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

    //     await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    //     await AsyncStorage.setItem('@RNAuth:token', response.token);
    // }

    async function signIn(login) {
        if (login.email.length === 0 || login.password.length === 0) {
            showError("preencha os campos para prosseguir");
        } else {
            try {
                const response = await api.post('/authentication/login', {
                    login: login.email,
                    password: login.password,
                });

                await AsyncStorage.setItem('@MHC:user', JSON.stringify(response.data.user));
                await AsyncStorage.setItem('@MHC:singned', !!response.data.user ? JSON.stringify(true) : JSON.stringify(false));
                await AsyncStorage.setItem('@MHC:token', response.data.token);

                api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
                setSigned(true);
                setLoading(false);
            } catch (_err) {
                showError(_err.response.data);
            }
        }
    };

    async function signUp(account) {
        console.log(account);
        if (account.email.length === 0 || account.lastName.length === 0 || account.name.length === 0 || account.cpf.length === 0 || account.password.length === 0 || account.confirmPassword.length === 0) {
            throw new Error('Preencha os campos para prosseguir');
        } else {
            try {
                const response = await api.post('/patient', {
                    email: account.email,
                    password: account.password,
                    confirmpassword: account.confirmPassword,
                    name: account.name,
                    lastName: account.lastName,
                    cpf: account.cpf
                });
            } catch (_err) {
                throw new Error(_err.response.data);
            }
        }
    }

    async function signUpPsychologist(user, psychologists) {
        try {
            Reactotron.log(user);
            Reactotron.log(psychologists);
            const response = await api.post('/psychologist', {
                user,
                psychologists
            });
            Reactotron.log(response);
        } catch (_err) {
            Reactotron.log(_err);
            throw new Error(_err);
        }
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null);
            setSigned(null);
        })
    }

    return (
        <AuthContext.Provider value={{ signed, created, user, loading, signIn, signUp, signOut, signUpPsychologist }}>
            {children}
        </AuthContext.Provider>
    );
};



export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}