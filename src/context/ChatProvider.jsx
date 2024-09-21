import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { joinChat } from '../utils/events';
import { useAppContext } from './AppProvider';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export default function ChatProvider({ children }) {
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsError, setChatsError] = useState(null);
  const { user, serverUrl } = useAppContext();
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const [onMobile, setOnMobile] = useState({
    isOnChat: false,
  });

  // Unificar `activeChatId`, `name` y `pic` en un solo estado
  const [activeChat, setActiveChat] = useState(
    () => JSON.parse(localStorage.getItem('activeChat')) || { id: null, name: '', pic: '' }
  );

  // Manejo del activeChat en localStorage y unión al chat
  useEffect(() => {
    if (activeChat.id !== null) {
      localStorage.setItem('activeChat', JSON.stringify(activeChat));
      if(socket) joinChat(socket, activeChat.id);
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if(activeChat.id !== null) {
      /* console.log('Se detecto un click en algun chat item ', activeChat); */
      joinChat(socket, activeChat.id);
    }
  }, [activeChat]);

  // Recuperar la lista de chats
  useEffect(() => {
    const getChats = async () => {
      setChatsLoading(true);
      try {
        const response = await fetch(`${serverUrl}/chats/user_id/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);

          // Si el chat activo existe, actualizamos `activeChat`
          if (data.length > 0 && activeChat.id) {
            const currentChat = data.find(chat => chat.id === activeChat.id);
            if (currentChat) {
              setActiveChat({
                id: currentChat.id,
                name: currentChat.name,
                pic: currentChat.pic
              });
            }
          }
        } else {
          setChatsError('Server internal error');
        }
      } catch (err) {
        setChatsError('Failed to fetch chats');
      } finally {
        setChatsLoading(false);
      }
    };

    if (user.id) getChats();
  }, [serverUrl, user.id, activeChat.id]);

  // Get all the messages of the activechat
  useEffect(() => {
    const getMessages = async() => {
        try {
            const response = await fetch(`${serverUrl}/chats/chat_id/${activeChat?.id}/messages?user_id=${user.id}`);
            if(response.ok) {
                const data = await response.json();
                /* console.log('messages:', data); */
                setMessages(data);
            }
        } catch(err) {
            console.error(err);
        }
      }
      if (activeChat && user.id) getMessages();
  }, [serverUrl, activeChat, user.id]);

  // useEffect para recibir eventos del socket
  useEffect(() => {
    if (socket) {
      // Escuchar eventos del servidor
      socket.on('new-message', (data) => {
        const newMessage = data.newMessage;
        const {content, status, sent_at} = newMessage;
        console.log(newMessage);

        setMessages(prev => ([...prev, newMessage]));

        // Renderizar la informacion del ultimo mensaje en chatList !!!
        setChats(prev => prev.map(chat => 
            chat.id === newMessage.chat_id ? { ...chat, last_message: { content, status, sent_at } } : chat
        ));
      });

      socket.on('chat-notification', (data) => {
        const chatNot = data.chatNotification;
        const isNewChat = !chats.some(chat => chat.id === chatNot.id);
        
        if (isNewChat) {
            console.log('new chat notification');
            const {id, is_group, last_message, name, pic, unread} = chatNot;
            // Agregar este chatNot como nuevo chat en la lista
            
            setChats(prev => ([{id, is_group, last_message, name, pic, unread_count: unread}, ...prev]));
        } else {
            console.log('chat notification');
            // Actualizar el chat con la nueva información (last_message y otras propiedades)
            setChats(prev => prev.map(chat => 
                chat.id === chatNot.id ? { ...chat, last_message: chatNot.last_message, unread_count: chatNot.unread } : chat
            ));
        }
      });
      
    }

    // Limpiar los eventos del socket cuando el componente se desmonte
    return () => {
      if (socket) {
        socket.off('new-message'); // Eliminar el evento 'new-message'
        socket.off('chat-notification'); // Eliminar el evento 'chat-notification'
      }
    };
  }, [socket, chats]);

  const data = {
    chats, setChats,
    activeChat, setActiveChat,
    chatsLoading, setChatsLoading,
    chatsError, setChatsError,
    messages, setMessages,
    onMobile, setOnMobile
  };

  return (
    <ChatContext.Provider value={data}>
      {children}
    </ChatContext.Provider>
  );
}
