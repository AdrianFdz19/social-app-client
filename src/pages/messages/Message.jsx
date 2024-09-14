import React from 'react'
import './styles/message.scss';
import icons from '../../assets/icons';

export default function Message({id, senderId, userId, content, status, sentAt}) {
  return (
    <div className={`msg-cont ${senderId === userId ? 'own' : ''}`}>
        <div className="msg-box">
            <div className="content">
                <p id='content' >{content}</p>
            </div>
            <div className="info">
                <p id='sentat' >{sentAt}</p>
                {senderId == userId && <div id='status' >
                  {
                    status == 'sent' ? (
                      <icons.check className='icon' />
                    ) : status == 'delivered' ? (
                      <icons.check className='icon' />
                    ) : (
                      <icons.dbcheck className='icon' />
                    )
                  }  
                </div> }
            </div>
        </div>
    </div>
  )
}
