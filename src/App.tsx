import React, { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { Loader } from './components/Loader';
import { NavBar } from './components/NavBar';
import { Context } from './utils/Context';
import firebase from 'firebase/app';

function App() {

  const {auth} = useContext(Context);
  const [user, loading, error] = useAuthState(auth);

  if(loading){
    return <Loader/>
  }
  
  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
