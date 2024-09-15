import React from 'react'
import './styles/sendmessage.scss';
import icons from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../context/ChatProvider';
import { useSocket } from '../context/SocketProvider';
import { joinChat } from '../utils/events';

export default function SendMessage({userId, targetId, serverUrl}) {

  const {setActiveChat} = useChatContext();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${serverUrl}/chats/open?user_id=${userId}&target_id=${targetId}`);
      if(response.ok) {
        const data = await response.json(); 
        const {chatId} = data;
        // console.log(data); // {isChatExists: false, chatId: 1}
        setActiveChat(prev => ({...prev, id: chatId}));
        navigate('/messages');
      } else {
        console.error('Server internal error');
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="sn-msg-cont" onClick={handleSendMessage} >
      <div className="sn-msg-box">
        <icons.sndmsg id='icon' />
        <p>Send message</p>
      </div>
    </div>
  )
}
