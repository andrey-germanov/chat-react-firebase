import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import 'antd/dist/antd.css';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { Context } from './utils/Context';

firebase.initializeApp(
  {
    apiKey: "AIzaSyD_wg6zcnTVkfCRQlUw2OUpFNwJEBnkVzQ",
    authDomain: "chat-react-fff94.firebaseapp.com",
    projectId: "chat-react-fff94",
    storageBucket: "chat-react-fff94.appspot.com",
    messagingSenderId: "283418412234",
    appId: "1:283418412234:web:39e270e4b4e21ec00ee033",
    measurementId: "G-1Z114TDNLG"
  }
);

const auth = firebase.auth();
const firestore = firebase.firestore();


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider value={{ firebase, auth, firestore }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);