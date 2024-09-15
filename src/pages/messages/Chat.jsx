import React, { useEffect, useState } from 'react'
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';
import { formatTimestamp } from '../../utils/client';
import { sendMessage } from '../../utils/events';

export default function Chat({serverUrl, userId, activeChat, name, pic, socket}) {

    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState({
        chatId: null,
        senderId: userId,
        content: ""
    });

    useEffect(() => {
        if(activeChat.id) {
            setMessage({...message, chatId: activeChat.id});
        }
    }, [activeChat]);

    /* {
        id: 0,
        sender_id: 1,
        content: 'Hi!',
        status: 'read',
        sent_at: '9:13 p.m.'
    }, */

    // Get all the messages of the conversation
    useEffect(() => {
        const getMessages = async() => {
            try {
                const response = await fetch(`${serverUrl}/chats/chat_id/${activeChat?.id}/messages?user_id=${userId}`);
                if(response.ok) {
                    const data = await response.json();
                    /* console.log('messages:', data); */
                    setMessages(data);
                }
            } catch(err) {
                console.error(err);
            }
        }
        if (activeChat) getMessages();
    }, [serverUrl, userId, activeChat]);

    const handleSendMessage = async(e)=> {
        e.preventDefault();
        try {
            /* console.log('sending message...', message); */
            sendMessage(socket, message);
        } catch(err) {
            console.error(err);
        }
    };

  return (
    <div className="chat-cont">
        <div className="header">
            <div className="chat-info">
                <ProfilePic
                    size={2.75}
                    url={pic}
                />
                <p id='chatname' >{name}</p>
            </div>
        </div>

        <div className="body">
            <div className="messages">
                {messages.map((msg) => {
                    return (
                        <Message
                            key={msg.id}
                            senderId={msg.sender_id}
                            content={msg.content}
                            status={msg.status}
                            sentAt={formatTimestamp(msg.sent_at)}
                            userId={userId}
                        />
                    )
                })}
            </div>
        </div>

        <div className="footer">
            <form className="ft-box" onSubmit={handleSendMessage} >
                <textarea placeholder='Write a message'
                    value={message.content}
                    onChange={(e)=>setMessage({...message, content: e.target.value})}
                ></textarea>
                <input type="submit" value="Send" />
            </form>
        </div>
    </div>
  )
}
