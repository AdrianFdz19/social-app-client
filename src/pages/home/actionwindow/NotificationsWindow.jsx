import React from 'react'
import { useNotifications } from '../../../context/NotificationsProvider'
import './styles/notificationswindow.scss';
import ProfilePic from '../../../components/ProfilePic';

export default function NotificationsWindow({handleClick}) {

    const {notifications} = useNotifications();
    console.log(notifications);

  return (
    <>
        {notifications && notifications.length > 0 &&
            notifications.map((not,i) => (
                <div className={`notsection ${not.read ? 'read' : 'notnew'}`} key={i}>
                    <div className="brief" >
                        <ProfilePic
                            size={2.3}
                            url={not.source_pic}
                        />
                        { not.type_not === 'follow' ? (
                            <div className="content">
                                <p id='sourcename' >{not.source_name}</p>
                                <p id='text' >{not.content}</p>
                            </div>
                        ) : (
                            <div className="content">
                                <p id='sourcename' >{not.source_name}</p>
                                <p id='text' >{not.content}</p>
                            </div>
                        ) }
                        
                    </div>
                </div>
            ))
        }
        <div className="open-section">
            <p
                onClick={handleClick}
            >Go to notifications</p>
        </div>
    </>
  )
}
