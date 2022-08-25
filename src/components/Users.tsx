//@ts-nocheck
import { Button, Input } from 'antd';
import React, { useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Context } from '../utils/Context';

export const Users = () => {
    const {auth, firestore} = useContext(Context);
    const [user]:any = useAuthState(auth);
    const [foundPerson, setFoundPerson] = useState('')
    const userChatRef = firestore.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollectionData(userChatRef);

    console.log(chatsSnapshot)
    console.log(users)

    const createChat = () => {
        if(!foundPerson) return null;

        if(foundPerson !== user.email && !chatAlreadyExists(foundPerson)){
            firestore.collection('chats').add({
                users: [user.email, foundPerson]
            })
            setFoundPerson('')
        }
    }

    const chatAlreadyExists = (recipiendEmail:any) => {
        return !!chatsSnapshot?.docs?.find((chat: any) => chat.data().users.find((user: any) => user === recipiendEmail)?.length > 0)
    }
    
    console.log(chatsSnapshot?.docs)
  return (
    <div>
        <input type='email' onChange={(e:any)=>setFoundPerson(e.target.value)} />
        <Button onClick={createChat}>Create chat</Button>
        {
            chatsSnapshot && chatsSnapshot?.docs.map(chat=> {
                return <div>
                    <pre>{JSON.stringify(chat, null, 2)}</pre>
                </div>
            })
        }
    </div>
  )
}
