import React, { useEffect, useState } from 'react'
import ChatList from './ChatList'
import Chat from './Chat'
import { useAppContext } from '../../context/AppProvider'
import './styles/messages.scss';
import './styles/messagesmovil.scss';
import { useChatContext } from '../../context/ChatProvider';
import { useSocket } from '../../context/SocketProvider';

export default function Messages() {
    const {user, serverUrl, isMobile} = useAppContext();
    const socket = useSocket();
    const {activeChat, setActiveChat, chats, setChats, chatsLoading, chatsError, messages, setMessages, onMobile, setOnMobile} = useChatContext();
    const {name, pic} = activeChat;

    const changeChatSection = () => {
      setOnMobile({...onMobile, isOnChat: !onMobile.isOnChat});
    };

  return (
    <div className="msgs-parent">
        <div className="msgs-cont">
          {
            isMobile ? (
              <div className="msg-mobile-cont">
                {onMobile.isOnChat ? (
                  <Chat 
                    serverUrl={serverUrl}
                    userId={user.id}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                    messages={messages}
                    setMessages={setMessages}
                    setChats={setChats}
                    name={name}
                    pic={pic}
                    chats={chats}
                    socket={socket}
                    changeChatSection={changeChatSection}
                  />
                ) : (
                  <ChatList
                    serverUrl={serverUrl}
                    userId={user.id}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                    chats={chats}
                    loading={chatsLoading}
                    error={chatsError}
                    socket={socket}
                    changeChatSection={changeChatSection}
                  />
                )}
              </div>
            ) : (
              <>
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
                  setChats={setChats}
                  name={name}
                  pic={pic}
                  chats={chats}
                  socket={socket}
                />
              </>
            )
          }
        </div>
    </div>
  )
}
