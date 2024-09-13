import React from 'react'
import './styles/chatitem.scss';
import ProfilePic from '../../components/ProfilePic';

export default function ChatItem({id, name, pic, isGroup, content, status, sentAt, unread}) {
  return (
    <div className="chat-item-cont">
        <div className="ch-it-box">
            <ProfilePic
                size={2.75}
                url={pic}
            />
            <div className="preview">
                <div className="brief">
                    <p id='chatname' >{name}</p>
                    <p className={`sentat ${unread > 0 ? 'unread' : ''}`} >{sentAt}</p>
                </div>
                <div className="last-msg">
                    <p id='lastmsg' >{content}</p>
                    {unread > 0 &&
                        <div className="unread">
                            <p>{unread}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
