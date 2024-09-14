import React, { createContext, useContext, useEffect, useState } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
    return useContext(ChatContext);
}

export default function ChatProvider({children}) {

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Recuperar el activeChatId del localStorage
  useEffect(() => {
    const activeChatIdLocal = JSON.parse(localStorage.getItem('activeChatId'));
    if (activeChatIdLocal) {
      setActiveChatId(activeChatIdLocal);
    }
  }, []); // Este effect solo se ejecuta una vez al montar el componente

  // Detectar un nuevo activeChatId y actualizar localStorage
  useEffect(() => {
    if (activeChatId !== null) { // Asegúrate de no guardar `null` en localStorage
      localStorage.setItem('activeChatId', JSON.stringify(activeChatId));
      console.log('New activeChatId set in localStorage: ', activeChatId);
    }
  }, [activeChatId]); // Este effect se ejecuta cada vez que activeChatId cambia

  const data = {
      chats, setChats,
      activeChatId, setActiveChatId
  };

  return (
    <ChatContext.Provider value={data} >
        {children}
    </ChatContext.Provider>
  )
}
