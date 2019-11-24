import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyDCQ7AflFITXBiFL_D18mXWvj0NLt9UACo',
  authDomain: 'slack-clone-be8d9.firebaseapp.com',
  databaseURL: 'https://slack-clone-be8d9.firebaseio.com',
  projectId: 'slack-clone-be8d9',
  storageBucket: 'slack-clone-be8d9.appspot.com',
  messagingSenderId: '655478927643',
  appId: '1:655478927643:web:6e0045cd8d85f96444a3be',
  measurementId: 'G-4QPQ8L45VZ'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// analytics for future
// firebase.analytics();

export default firebase;
