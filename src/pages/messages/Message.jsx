import React from 'react'
import './styles/message.scss';

export default function Message({id, senderId, userId, content, status, sentAt}) {
  return (
    <div className={`msg-cont ${senderId === userId ? 'own' : ''}`}>
        <div className="msg-box">
            <div className="content">
                <p id='content' >{content}</p>
            </div>
            <div className="info">
                <p id='sentat' >{sentAt}</p>
                {senderId == userId && <p id='status' >{status}</p> }
            </div>
        </div>
    </div>
  )
}
