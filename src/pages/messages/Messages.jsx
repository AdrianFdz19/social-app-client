import React from 'react'
import ChatList from './ChatList'
import Chat from './Chat'
import { useAppContext } from '../../context/AppProvider'
import './styles/messages.scss';

export default function Messages() {

    const {user, serverUrl} = useAppContext();

  return (
    <div className="msgs-parent">
        <div className="msgs-cont">
            <ChatList
                serverUrl={serverUrl}
                userId={user.id}
            />

            <Chat />
        </div>
    </div>
  )
}
