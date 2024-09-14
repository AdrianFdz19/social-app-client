import React, { useEffect, useState } from 'react';
import './styles/chatlist.scss';
import ChatItem from './ChatItem';
import { useChatContext } from '../../context/ChatProvider';
import { formatTimestamp } from '../../utils/client';

export default function ChatList({ serverUrl, userId }) {
    const { chats, setChats } = useChatContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${serverUrl}/chats/user_id/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setChats(data);
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
    }, [serverUrl, userId, setChats]);

    if (loading) {
        return <div className="chatlist-cont">Loading...</div>;
    }

    if (error) {
        return <div className="chatlist-cont">Error: {error}</div>;
    }

    return (
        <div className="chatlist-cont">
            <div className="header">
                <h3>Chats</h3>
            </div>
            <div className="list">
                {chats.length === 0 ? (
                    <div>No chats available</div>
                ) : (
                    chats.map((chat) => {
                        const lastMessage = chat.last_message || {};
                        return (
                            <ChatItem
                                key={chat.id}
                                id={chat.id}
                                name={chat.name}
                                pic={chat.pic}
                                isGroup={chat.is_group}
                                content={lastMessage.content || 'No messages yet'}
                                status={lastMessage.status || 'sent'}
                                sentAt={lastMessage.sent_at ? formatTimestamp(lastMessage.sent_at) : ''}
                                unread={chat.unread_count}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
