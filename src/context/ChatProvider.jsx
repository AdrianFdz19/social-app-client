import React, { createContext, useContext, useState } from 'react'
const ChatContext = createContext();
export const useChatContext = () => {
    return useContext(ChatContext);
}

export default function ChatProvider({children}) {

    const [chats, setChats] = useState([]);

    const data = {
        chats, setChats
    };

  return (
    <ChatContext.Provider value={data} >
        {children}
    </ChatContext.Provider>
  )
}
