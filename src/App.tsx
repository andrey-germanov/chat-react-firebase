import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { Loader } from './components/Loader';
import { NavBar } from './components/NavBar';
import { Context } from './utils/Context';
import firebase from 'firebase/app';
import { Users } from './components/Users';

function App() {

  const {auth, firestore} = useContext(Context);
  const [user, loading]: any = useAuthState(auth);
  useEffect(() => {
      if(user) {
        firestore.collection('users').doc(user.uid).set({
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
      }, {merge: true}
      )
      }
  }, [user])

  if(loading){
    return <Loader/>
  }

  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>
      {/* <Users /> */}
    </BrowserRouter>
  );
}

export default App;
