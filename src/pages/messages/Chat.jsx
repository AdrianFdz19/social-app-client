import React from 'react'
import './styles/chat.scss';
import ProfilePic from '../../components/ProfilePic';
import Message from './Message';

export default function Chat() {

    let userId = 1;

    let clientMessages = [
        {
            id: 0,
            sender_id: 1,
            content: 'Hi!',
            status: 'read', /* sent, delivered, read */
            sent_at: '9:13 p.m.'
        },
        {
            id: 1,
            sender_id: 2,
            content: 'Hi! How are you!',
            status: 'read', /* sent, delivered, read */
            sent_at: '9:13 p.m.'
        },
        {
            id: 2,
            sender_id: 1,
            content: 'Excelent!!!',
            status: 'read', /* sent, delivered, read */
            sent_at: '9:13 p.m.'
        },
    ];

  return (
    <div className="chat-cont">
        <div className="header">
            <div className="chat-info">
                <ProfilePic
                    size={2.75}
                />
                <p id='chatname' >username</p>
            </div>
        </div>

        <div className="body">
            <div className="messages">
                {clientMessages.map((msg) => {
                    return (
                        <Message
                            key={msg.id}
                            senderId={msg.sender_id}
                            content={msg.content}
                            status={msg.status}
                            sentAt={msg.sent_at}
                            userId={userId}
                        />
                    )
                })}
            </div>
        </div>

        <div className="footer">
            <form className="ft-box">
                <textarea placeholder='Write a message' ></textarea>
                <input type="submit" value="Send" />
            </form>
        </div>
    </div>
  )
}
