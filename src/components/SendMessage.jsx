import React from 'react'
import './styles/sendmessage.scss';
import icons from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../context/ChatProvider';
import { useSocket } from '../context/SocketProvider';
import { joinChat } from '../utils/events';

export default function SendMessage({userId, targetId, serverUrl}) {

  /* Logica
    1.- Verificar si el chat esta creado. 
    2.- Si no existe el chat:
      - Crear el chat nuevo
      - Enlazar a los dos usuarios al chat en chat_members
      - activar este unicamente para el usuario que lo abrio (is_active = true en user_chat)
      - Retornar el chat_id del creado para guardarlo en el localstorage como activeChatId
    3.- Si existe el chat:  
      - Retornar unicamente el chat_id para guardarlo en el localstorage como activeChatId
  */

  const {setActiveChatId} = useChatContext();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${serverUrl}/chats/open?user_id=${userId}&target_id=${targetId}`);
      if(response.ok) {
        const data = await response.json(); 
        const {chatId} = data;
        // console.log(data); // {isChatExists: false, chatId: 1}
        setActiveChatId(chatId);
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
