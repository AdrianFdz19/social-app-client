import React, { useEffect, useState } from 'react'
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';
import { formatTimestamp } from '../../utils/client';

export default function Chat({serverUrl, userId, activeChatId}) {

    const [messages, setMessages] = useState([]);

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
                const response = await fetch(`${serverUrl}/chats/chat_id/${activeChatId}/messages?user_id=${userId}`);
                if(response.ok) {
                    const data = await response.json();
                    console.log('messages:', data);
                    setMessages(data);
                }
            } catch(err) {
                console.error(err);
            }
        }
        if (activeChatId) getMessages();
    }, [serverUrl, userId, activeChatId]);

  return (
    <div className="chat-cont">
        <div className="header">
            <div className="chat-info">
                <ProfilePic
                    size={2.75}
                />
                <p id='chatname' >username</p>
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
            <form className="ft-box">
                <textarea placeholder='Write a message' ></textarea>
                <input type="submit" value="Send" />
            </form>
        </div>
    </div>
  )
}
