import React, { useEffect, useState } from 'react'
import ChatList from './ChatList'
import Chat from './Chat'
import { useAppContext } from '../../context/AppProvider'
import './styles/messages.scss';
import { useChatContext } from '../../context/ChatProvider';
import { useSocket } from '../../context/SocketProvider';

export default function Messages() {
    const {user, serverUrl} = useAppContext();
    const socket = useSocket();
    const {activeChat, setActiveChat, chats, chatsLoading, chatsError, messages, setMessages} = useChatContext();
    const {name, pic} = activeChat;

  return (
    <div className="msgs-parent">
        <div className="msgs-cont">
            <ChatList
                serverUrl={serverUrl}
                userId={user.id}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                chats={chats}
                loading={chatsLoading}
                error={chatsError}
                socket={socket}
            />

            <Chat 
              serverUrl={serverUrl}
              userId={user.id}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              messages={messages}
              setMessages={setMessages}
              name={name}
              pic={pic}
              chats={chats}
              socket={socket}
            />
        </div>
    </div>
  )
}
