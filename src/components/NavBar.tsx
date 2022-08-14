import { Button } from 'antd'
import React, { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
import { Context } from '../utils/Context';

export const NavBar = () => {

    const {auth} = useContext(Context);
    const [user] = useAuthState(auth);

    return (
    <header style={{background: 'blue', height: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{ color: 'white'}}>
            Маленький, пока что групповой чат на firebase
        </div>
        <div>
            {
                user ? <Button onClick={()=> auth.signOut()}>Logout</Button> : <NavLink to={LOGIN_ROUTE}><Button>Login</Button></NavLink>
            }
        </div>
    </header>
    )
}
