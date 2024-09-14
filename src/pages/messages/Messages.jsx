import React, { useEffect, useState } from 'react'
import ChatList from './ChatList'
import Chat from './Chat'
import { useAppContext } from '../../context/AppProvider'
import './styles/messages.scss';
import { useChatContext } from '../../context/ChatProvider';
import { useSocket } from '../../context/SocketProvider';
import { joinChat } from '../../utils/events';

export default function Messages() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user, serverUrl} = useAppContext();
    const socket = useSocket();
    const {activeChatId, chats, setChats} = useChatContext();
    const [activeChatInfo, setActiveChatInfo] = useState({
      name: '',
      pic: ''
    });

    useEffect(() => {
      const getChats = async () => {
          setLoading(true);
          try {
              const response = await fetch(`${serverUrl}/chats/user_id/${user.id}`);
              if (response.ok) {
                  const data = await response.json();
                  console.log(data);
                  setChats(data);
                  if(data.length > 0) {
                    let current = data.find(chat => chat.id == activeChatId);
                    setActiveChatInfo({
                      name: current.name,
                      pic: current.pic
                    });

                    //Join chat socket
                    joinChat(socket, activeChatId);
                  }
              } else {
                  console.error('Server internal error');
                  setError('Server internal error');
              }
          } catch (err) {
              console.error(err);
              setError('Failed to fetch chats');
          } finally {
              setLoading(false);
          }
      };
      getChats();
  }, [serverUrl, setChats, socket, activeChatId]);

  return (
    <div className="msgs-parent">
        <div className="msgs-cont">
            <ChatList
                serverUrl={serverUrl}
                userId={user.id}
                activeChatId={activeChatId}
                chats={chats}
                loading={loading}
                error={error}
                socket={socket}
                setActiveChatInfo={setActiveChatInfo}
            />

            <Chat 
              serverUrl={serverUrl}
              userId={user.id}
              activeChatId={activeChatId}
              activeChatInfo={activeChatInfo}
              chats={chats}
            />
        </div>
    </div>
  )
}
