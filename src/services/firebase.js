import firebase from '@react-native-firebase/app'

var firebaseConfig = {
  apiKey: "AIzaSyColfcxR9QTpjXEdFKoCckuzO26ZAjIhxo",
  authDomain: "mhc-tcc.firebaseapp.com",
  databaseURL: "https://mhc-tcc.firebaseio.com",
  projectId: "mhc-tcc",
  storageBucket: "mhc-tcc.appspot.com",
  messagingSenderId: "558012787340",
  appId: "1:558012787340:web:1921e7b86ae14bfe9ce9a9",
  measurementId: "G-E77G8147BQ"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const myFirebaseApp = null

export default myFirebaseApp;