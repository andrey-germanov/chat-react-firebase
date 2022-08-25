import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Context } from '../utils/Context';
import { Loader } from './Loader';
import firebase from 'firebase';
import moment from 'moment';
import { Button, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import meloboom from '../voice notification/meloboom.mp3';

export const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const [user]:any = useAuthState(auth);
    const [value, setValue] = useState('');
    const messagesEndRef = useRef<null | HTMLElement>(null);
    const [messages, loading] = useCollectionData(firestore.collection('messages').orderBy('createdAt'));
    const audioPlayer = useRef<HTMLAudioElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
        playAudio();
    }, [messages]);
    const playAudio = () => {
        if(!audioPlayer.current) return
        audioPlayer?.current?.play();
    }
    
    const sendMessage = async () => {
        if(value.length <=1) return
        firestore.collection('messages').add({
            uid: user.uid,
            // id: user.uid + '1',
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
    console.log(value.length)
    const sendMessageByEnter = (e:any) => {
        console.log(e.code === 'Enter' && e.shiftKey)
        if(e.code === 'Enter' && e.shiftKey) {
            setValue('\n')
        }
        if(e.code === 'Enter'){
            e.preventDefault();
            sendMessage();
        }

        // setValue('');
        // setValue('\n')
        // console.log(value)
    }
  return (
    <div style={{margin: '0 auto'}}
        onKeyPress={sendMessageByEnter}
    >
        <div style={{
            background: '#e6e1e1',
            height: '500px',
            overflow: 'scroll',
            padding: '0 10px',
            width: '100%'
        }}
        >

            <span>Показано {`${messages && messages.length >= 60 ? Math.floor(messages.length / 2) : messages?.length}`} сообщения</span>
            {
                messages ? messages.map(({uid, name, photoURL, text, createdAt})=>{
                    return (
                        <div style={{
                            margin: '20px',
                            padding: '10px',
                            marginLeft: uid === user.uid ? 'auto' : '0',
                            minWidth: 'fit-content',
                            color: uid === user.uid ? '#ffffffe6' : 'rgb(24 24 24 / 90%)',
                            width: '100px',
                            background: uid === user.uid ? 'rgb(122 122 234)' : 'rgb(200 200 241)',
                            borderRadius: '20px',
                            boxShadow: 'rgb(0 0 0 / 24%) 0px 7px 29px 0px'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <img style={{width: '30px', borderRadius: '50%'}} src={photoURL} alt="" />
                                <div>{name}</div>
                                {uid !== user.uid ? <audio ref={audioPlayer} src={meloboom}/> : null}
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
        <div style={{padding: '10px', width: '100%'}}>
            <TextArea
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                rows={2} placeholder="Write something"    
            />
            <Button style={{margin: '10px auto', display: 'block', width: '200px'}} type='primary' htmlType='submit' onClick={sendMessage}>Send Message</Button>
        </div>
    </div>
  )
}
