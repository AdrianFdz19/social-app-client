import React, { useEffect, useState } from 'react';
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';
import { formatTimestamp } from '../../utils/client';
import { sendMessage } from '../../utils/events';
import {v4} from 'uuid'
import icons from '../../assets/icons';

export default function Chat({ serverUrl, userId, activeChat, messages, setMessages, setChats, name, pic, socket, changeChatSection = null }) {

    const [message, setMessage] = useState({
        chatId: null,
        senderId: userId || null,
        content: "",
        sentAt: null // Inicializamos en null
    });

    useEffect(() => {
        if(userId) {
            setMessage(prev => ({...prev, senderId: userId}));
        }
    }, [userId]);

    // Actualizar el chatId cuando activeChat cambia
    useEffect(() => {
        if (activeChat.id) {
            setMessage((prevMessage) => ({
                ...prevMessage,
                chatId: activeChat.id
            }));
        }
    }, [activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            /* console.log(message); */

            // Enviamos el mensaje a través del socket
            sendMessage(socket, message);

            // Limpiamos el campo de texto después de enviar el mensaje
            setMessage({
                ...message,
                content: "", // Reseteamos el contenido
                sentAt: null // Reseteamos sentAt
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-cont">
            {
                activeChat.id ? (
                    <>
                    <div className="header">
                        {changeChatSection &&
                            <icons.leaveArrow id='leaveArrow'
                                onClick={changeChatSection}
                            />
                        }
                        <div className="chat-info">
                            <ProfilePic size={2.75} url={pic} />
                            <p id='chatname'>{name}</p>
                        </div>
                    </div>

                    <div className="body">
                        <div className="messages">
                            {messages.map((msg) => (
                                <Message
                                    key={msg.message_id}
                                    senderId={msg.sender_id}
                                    content={msg.content}
                                    status={msg.status}
                                    sentAt={formatTimestamp(msg.sent_at)}
                                    userId={userId}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="footer">
                        <form className="ft-box" onSubmit={handleSendMessage}>
                            <textarea
                                placeholder="Write a message"
                                value={message.content}
                                onChange={(e) =>
                                    setMessage({ ...message, content: e.target.value })
                                }
                            ></textarea>
                            <input type="submit" value="Send" />
                        </form>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="none-active-chat">
                        <div className="box">
                            <icons.messages id='none-icon' />
                            <p>Select a chat to start sending messages.</p>
                        </div>
                    </div>
                    </>
                )
            }
        </div>
    );
}
