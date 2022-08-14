import { useContext, useState } from 'react'
import { Button } from 'antd';
import { Context } from '../utils/Context';
import firebase from 'firebase';

export const Login = () => {
    const {auth} = useContext(Context);

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    }
  return (
    <Button onClick={login}>
        Войти c помощью Google
    </Button>
  )
}
