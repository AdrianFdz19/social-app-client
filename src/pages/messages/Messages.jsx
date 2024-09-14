import React from 'react'
import ChatList from './ChatList'
import Chat from './Chat'
import { useAppContext } from '../../context/AppProvider'
import './styles/messages.scss';
import { useChatContext } from '../../context/ChatProvider';

export default function Messages() {

    const {user, serverUrl} = useAppContext();
    const {activeChatId} = useChatContext();

  return (
    <div className="msgs-parent">
        <div className="msgs-cont">
            <ChatList
                serverUrl={serverUrl}
                userId={user.id}
                activeChatId={activeChatId}
            />

            <Chat 
              serverUrl={serverUrl}
              userId={user.id}
              activeChatId={activeChatId}
            />
        </div>
    </div>
  )
}
