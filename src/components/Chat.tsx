import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Context } from '../utils/Context';
import { Loader } from './Loader';
import firebase from 'firebase';
import moment from 'moment';
import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

export const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const [user]:any = useAuthState(auth);
    const [value, setValue] = useState('');
    const messagesEndRef = useRef<null | HTMLElement>(null);
    const [messages, loading] = useCollectionData(firestore.collection('messages').orderBy('createdAt'));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if(value.length === 0) return

        firestore.collection('messages').add({
            uid: user.uid,
            id: user.uid + '1',
            name: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('');
        scrollToBottom();
    }

    if(loading){
        return <Loader />
    }

  return (
    <div style={{margin: '0 auto'}}>
        показано {`${messages && messages.length >= 60 ? Math.floor(messages.length / 2) : messages?.length}`} сообщения
        <div style={{
                background: 'grey',
                color: 'blue',
                height: '500px',
                overflow: 'scroll',
            }}
        >
            {
                messages ? messages.slice(messages.length / 2, messages.length).map(({id, uid, name, photoURL, text, createdAt})=>{
                    return (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px',
                            border: '1px solid black',
                            marginLeft: uid === user.uid ? 'auto' : '0',
                            minWidth: 'fit-content',
                            height: '100px',
                            width: '100px',
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <img style={{width: '30px', borderRadius: '50%'}} src={photoURL} alt="" />
                                <div>{name}</div>
                            </div>
                            <span style={{padding: '2px 0', display: 'block'}} ref={text === messages[messages.length - 1].text ? messagesEndRef : null}>{text}</span> 
                            <div>{createdAt && moment(createdAt.seconds*1000).format('LTS')}</div>
                        </div>
                    )
                })
                :
                <div>write something</div>
            }
        </div>
        <TextArea value={value} onChange={(e)=>setValue(e.target.value)} />
        <Button style={{margin: '0 auto', display: 'block', width: '200px'}} type='primary' htmlType='submit' onClick={sendMessage}>Send Message</Button>
    </div>
  )
}
