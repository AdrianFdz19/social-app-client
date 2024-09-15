import React, { useEffect, useState } from 'react';
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';
import { formatTimestamp } from '../../utils/client';
import { sendMessage } from '../../utils/events';
import {v4} from 'uuid'

export default function Chat({ serverUrl, userId, activeChat, messages, setMessages, name, pic, socket }) {

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
            console.log(message);
            // Si sentAt es null, asignamos la fecha actual
            const updatedMessage = {
                id: v4(),
                sender_id: message.senderId,
                content: message.content,
                sent_at: message.sentAt || new Date() // Asignamos la fecha actual si es null
            };

            // Enviamos el mensaje a través del socket
            sendMessage(socket, message);

            // Actualizamos el estado de messages con el nuevo mensaje
            setMessages((prev) => [...prev, updatedMessage]);

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
            <div className="header">
                <div className="chat-info">
                    <ProfilePic size={2.75} url={pic} />
                    <p id='chatname'>{name}</p>
                </div>
            </div>

            <div className="body">
                <div className="messages">
                    {messages.map((msg) => (
                        <Message
                            key={msg.id}
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
        </div>
    );
}
