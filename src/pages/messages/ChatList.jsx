import React, { useEffect, useState } from 'react';
import './styles/chatlist.scss';
import ChatItem from './ChatItem';
import { useChatContext } from '../../context/ChatProvider';
import { formatTimestamp } from '../../utils/client';

export default function ChatList({ serverUrl, chats, loading, error, activeChat, setActiveChat, changeChatSection }) {

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
                    <div className="empty-list">
                        <p>You don't have any chats yet. Start a conversation!</p>
                    </div>
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
                                activeChat={activeChat}
                                setActiveChat={setActiveChat}
                                changeChatSection={changeChatSection}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
