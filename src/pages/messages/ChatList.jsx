import React,{ useEffect } from 'react'
import './styles/chatlist.scss';
import ChatItem from './ChatItem';
import { useChatContext } from '../../context/ChatProvider';
import { formatTimestamp } from '../../utils/client';

export default function ChatList({serverUrl, userId}) {

    const {chats, setChats} = useChatContext();

    let clientChatList = [
        {
            id: 0,
            name: 'username',
            pic: '',
            is_group: false,
            unread: 9,
            last_message: {
                content: 'Hi everyone!',
                status: 'read', /* sent, delivery, read */
                sent_at: '9:13 p.m.'
            }

        },
    ];

    //Recuperar la lista de los chats
    useEffect(() => {
        const getChats = async() => {
            try {
                const response = await fetch(`${serverUrl}/chats/user_id/${userId}`);
                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setChats(data);
                } else {
                    console.error('Server internal error');
                }
            } catch(err) {
                console.error(err);
            }
        };
        getChats();
    }, [serverUrl, userId, setChats]);


  return (
    <div className="chatlist-cont">
        <div className="header">
            <h3>Chats</h3>
        </div>
        <div className="list">

            { chats.map((chat) => {
                return (
                    <ChatItem
                        key={chat.id}
                        id={chat.id}
                        name={chat.name}
                        pic={chat.pic}
                        isGroup={chat.is_group}
                        content={chat.last_message.content}
                        status={chat.last_message.status}
                        sentAt={formatTimestamp(chat.last_message.sent_at)}
                        unread={chat.unread}
                    />
                )
            }) }

        </div>
    </div>
  )
}
