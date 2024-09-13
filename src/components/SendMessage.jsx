import React from 'react'
import './styles/sendmessage.scss';
import icons from '../assets/icons';

export default function SendMessage({userId, targetId}) {

  

  return (
    <div className="sn-msg-cont">
      <div className="sn-msg-box">
        <icons.sndmsg id='icon' />
        <p>Send message</p>
      </div>
    </div>
  )
}
