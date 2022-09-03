import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Context } from '../utils/Context';
import { Loader } from './Loader';
import firebase from 'firebase';
import moment from 'moment';
import { Button,  } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import meloboom from '../voice notification/meloboom.mp3';
import Picker, { IEmojiData } from 'emoji-picker-react';
import emojiIcon from './emoji.png';

interface IValue {
    value: string;
    emoji: string;
}
export const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const [user]:any = useAuthState(auth);
    const [value, setValue] = useState('');
    const messagesEndRef = useRef<null | HTMLElement>(null);
    const [messages, loading] = useCollectionData(firestore.collection('messages').orderBy('createdAt'));
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const [chosenEmoji, setChosenEmoji] = useState<IEmojiData | null>(null);
    const [showEmoji, setShowEmoji] = useState(false)

    const onEmojiClick = (event: React.MouseEvent, data: IEmojiData) => {
      setChosenEmoji({...chosenEmoji, ...data});
      
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
        playAudio();
    }, [messages]);

    useEffect(()=>{
        if (value || chosenEmoji?.emoji) setValue(value + chosenEmoji?.emoji)
    }, [chosenEmoji]);

    const playAudio = () => {
        if(!audioPlayer.current) return
        if(messages && messages[messages?.length - 1].uid !== user.uid) audioPlayer?.current?.play();;
    }
    
    const sendMessage = async () => {
        if(value.length <=1) return
        firestore.collection('messages').add({
            uid: user.uid,
            name: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('');
        setChosenEmoji(null);
        scrollToBottom();
    }
    
    if(loading){
        return <Loader />
    }
    const sendMessageByEnter = (e:any) => {
        console.log(e.code === 'Enter' && e.shiftKey)
        if(e.code === 'Enter' && e.shiftKey) {setValue(prev => `${prev}\n`) }
        if(e.code === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    }
    const setValueInput = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        // const value = 
        setValue(e.target.value)
    }
  return (
    <div style={{margin: '0 auto'}}
        onKeyPress={sendMessageByEnter}
    >
        <div style={{
            background: '#e6e1e1',
            height: '500px',
            overflowY: 'scroll',
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
                            <audio ref={audioPlayer} src={meloboom}/>
                            {
                                messages[messages.length - 1].uid !== uid ? <></> : <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <img style={{width: '30px', borderRadius: '50%'}} src={photoURL} alt="" />
                                <div>{name}</div>
                            </div>
                            }
                            <span style={{padding: '2px 0', display: 'block'}} ref={text === messages[messages.length - 1].text ? messagesEndRef : null}>{text}</span> 
                            <div>{createdAt && moment(createdAt.seconds*1000).format('LTS')}</div>
                        </div>
                    )
                })
                :
                <div>write something</div>
            }
        </div>
        <div style={{padding: '10px', width: '100%', position: 'relative'}}>
            <span
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                    paddingBottom: '10px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex:'2'
                }}
                onClick={()=>setShowEmoji(!showEmoji)}
            >
                <img width={30} src={emojiIcon} alt="" />
            {
                showEmoji && 
                <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '30px',
                        zIndex: '2'
                    }}
                >
                    <Picker
                        preload={true}
                        disableSearchBar={true}
                        disableAutoFocus={true}
                        onEmojiClick={onEmojiClick}
                    />
                </div>
            }
            </span>
            {/* <Users /> */}
            <TextArea
                value={value}
                onChange={(e)=>setValueInput(e)}
                rows={2} placeholder="Write something"    
            />
            <Button
                style={{
                    margin: '10px auto',
                    display: 'block',
                    width: '200px'
                }}
                type='primary'
                htmlType='submit'
                onClick={sendMessage}
            >
                Send Message
            </Button>
        </div>
    </div>
  )
}
