import React, { act, useEffect, useState } from 'react'
import './styles/header.scss';
import { useAppContext } from '../../context/AppProvider';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';
import { useRef } from 'react';
import { useNotifications } from '../../context/NotificationsProvider';
import ActionWindow from '../../pages/home/actionwindow/ActionWindow';

export default function Header() {
  const navigate = useNavigate()
  const {user, setUser} = useAppContext();
  const {notCount} = useNotifications();
  const [actionsWindow, setActionsWindow] = useState({
    open: false,
    section: ''
  });
  
  const actionWindowRef = useRef(null);
  const handleWindow = (section) => setActionsWindow({open: true, section});

  // Efecto para cerrar la ventana si se hace clic fuera de ella
  useEffect(() => {
    function handleClickOutside(event) {
        if (actionWindowRef.current && !actionWindowRef.current.contains(event.target)) {
            setActionsWindow({ open: false, section: '' });
        }
    }

    // Agregar el evento de clic al documento
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        // Limpiar el evento cuando se desmonta el componente
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionWindowRef]);

  const redirect = (route) => navigate(route);

  return (
    <div className="header-cont">
        <div className="header-box">
            {actionsWindow.open &&
              <div className="act-wind-cont" ref={actionWindowRef}>
                <div className="act-wind-box">
                  <ActionWindow 
                    setActionsWindow={setActionsWindow}
                    section={actionsWindow.section} 
                    user={user}
                    redirect={redirect}
                    setUser={setUser}
                  />
                </div>
              </div>
            }
            <h3 onClick={()=>redirect(`/`)} >SOCIAL APP</h3>

            <div className="sections">
              <div className="section"
                onClick={()=>handleWindow('messages')}
              >
                <icons.messages className='icon' />
              </div>
              <div className="section mid"
                onClick={()=>handleWindow('notifications')}
              >
                {notCount > 0 && 
                  <div className="not-count">
                    {notCount <= 10 ? notCount : '+10'}
                  </div>
                }
                <icons.notifications className='icon' />
              </div>
              <div className="section" id='profile'
                onClick={()=>handleWindow('profile')}
              >
                <ProfilePic
                  size={2.5}
                  url={user.imgs.profilePic}
                />
              </div>
            </div>
        </div>
    </div>
  )
}
