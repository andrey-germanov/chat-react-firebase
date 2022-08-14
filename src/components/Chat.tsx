import { useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Context } from '../utils/Context';
import { Loader } from './Loader';
import firebase from 'firebase';

export const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const [user]:any = useAuthState(auth);
    const [value, setValue] = useState('')
    const [messages, loading] = useCollectionData(firestore.collection('messages').orderBy('createdAt'));

    const sendMessage = async () => {
        firestore.collection('messages').add({
            uid: user.uid,
            name: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue(' ')
    }

    if(loading){
        return <Loader />
    }
    

  return (
    <div style={{margin: '0 auto'}}>
        <div style={{background: 'grey', color: 'blue', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'scroll', height: '70vh', justifyContent: 'flex-end'}}>
            {
                messages ? messages.map(({uid, name, photoURL, text, createdAt})=>{
                    return (
                        <div style={{marginTop: '10px', padding: '10px', border: '1px solid black', alignSelf: uid === user.uid ? 'end' : 'auto'}}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img style={{width: '30px'}} src={photoURL} alt="" />
                                <div>{name}</div>
                            </div>
                            <span>{text}</span> 
                            <div>{createdAt && new Date(createdAt.seconds*1000).toLocaleDateString()}</div>
                        </div>
                    )
                })
                :
                <div>write something</div>
            }
        </div>
        <textarea value={value} onChange={(e)=>setValue(e.target.value)} />
        <button onClick={sendMessage}>send</button>
    </div>
  )
}
