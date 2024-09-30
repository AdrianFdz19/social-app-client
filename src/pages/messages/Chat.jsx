import React, { useEffect, useState, useRef } from 'react';
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';
import { formatTimestamp } from '../../utils/client';
import { sendMessage } from '../../utils/events';
import { v4 } from 'uuid';
import icons from '../../assets/icons';

export default function Chat({ serverUrl, userId, activeChat, messages, setMessages, chats, setChats, name, pic, socket, changeChatSection = null }) {
    const [message, setMessage] = useState({
        chatId: null,
        senderId: userId || null,
        content: "",
        sentAt: null
    });

    const messagesEndRef = useRef(null); // Referencia para el final de los mensajes

    // Usaremos esta referencia para observar los mensajes
    const messageRefs = useRef([]);

    // Actualiza el id de chat cuando cambia activeChat
    useEffect(() => {
        if (activeChat.id) {
            setMessage((prevMessage) => ({
                ...prevMessage,
                chatId: activeChat.id
            }));
        }
    }, [activeChat]);

    // Listener de mensajes leídos
    useEffect(() => {
        if (socket) {
            socket.on('read-message', (message) => {
                const { chatId, messageId } = message;
                /* console.log(`Alguien leyó tu mensaje: `, messageId); */
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id == messageId && msg.status === 'sent'
                            ? { ...msg, status: 'read' }
                            : msg
                    )
                );
            });
        }
    
        return () => {
            if (socket) {
                socket.off('read-message');
            }
        };
    }, [socket]);

    // Actualiza el scroll cuando hay nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Observer para detectar mensajes visibles
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const messageId = entry.target.getAttribute('data-message-id');
                const senderId = entry.target.getAttribute('data-sender-id');
                const status = entry.target.getAttribute('data-status');

                // Solo observar los mensajes en estado 'sent'
                if (!messageId || status !== 'sent') return;

                if (entry.isIntersecting && Number(senderId) !== Number(userId)) {
                    /* console.log('Mensaje visto: ', messageId, 'SenderId:', senderId, 'UserId:', userId); */
                    
                    // Emitir evento solo si el mensaje aún no ha sido leído
                    socket.emit('read-message', { messageId, chatId: activeChat.id, senderId, userId });
                    // Actualiza los chats locales para actualizar el unread_count especifico

                    setChats(prev => prev.map(chat => 
                        chat.id === activeChat.id ? { ...chat, unread_count: chat.unread_count - 1 } : chat
                    ));
                    
                    // Actualiza el estado local para marcar como leído
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id == messageId
                                ? { ...msg, status: 'read' }
                                : msg
                        )
                    );
                }
            });
        }, { threshold: 0.5 });

        // Filtra los mensajes no leídos y observar esos
        const unreadMessages = messageRefs.current.filter((ref, index) => {
            const msg = messages[index];
            return msg && msg.status === 'sent';
        });

        unreadMessages.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            unreadMessages.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [messages, socket, userId, activeChat.id]); // Aquí incluyes `messages` para actualizar el observer en mensajes nuevos

    // Manejo de envío de mensajes
    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            sendMessage(socket, message);
            setMessage({
                ...message,
                content: "",
                sentAt: null
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
                                <icons.leaveArrow id='leaveArrow' onClick={changeChatSection} />
                            }
                            <div className="chat-info">
                                <ProfilePic size={2.75} url={pic} />
                                <p id='chatname'>{name}</p>
                            </div>
                        </div>

                        <div className="body">
                            <div className="messages">
                                {messages
                                    .filter(msg => msg.id)  // Filtra solo mensajes que tengan message_id definido
                                    .map((msg, index) => (
                                        <div 
                                            key={msg.id} 
                                            ref={el => messageRefs.current[index] = el} 
                                            data-message-id={msg.id}
                                            data-sender-id={msg.sender_id}
                                            data-status={msg.status} 
                                        >
                                            <Message
                                                key={msg.id}
                                                senderId={msg.sender_id}
                                                content={msg.content}
                                                status={msg.status}
                                                sentAt={formatTimestamp(msg.sent_at)}
                                                userId={userId}
                                            />
                                        </div>
                                    ))}
                                <div ref={messagesEndRef} /> {/* Esto es para el scroll */}
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
                    <div className="none-active-chat">
                        <div className="box">
                            <icons.messages id='none-icon' />
                            <p>Select a chat to start sending messages.</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
