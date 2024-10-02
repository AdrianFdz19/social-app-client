import React from 'react'
import './styles/actionwindow.scss'
import ProfilePic from '../../../components/ProfilePic';
import icons from '../../../assets/icons';
import NotificationsWindow from './NotificationsWindow';

export default function ActionWindow({section, user, redirect, setUser, setActionsWindow}) {

    const logout = () => {
        setUser({});
        localStorage.removeItem('authToken');
        redirect(`/sign-in`);
    };

    const clickSection = (callback) => {
        callback();
        setActionsWindow(false);
    };

  return (
    <>
        {section == 'profile' ? (
            <>
                <div className="section"
                    onClick={() => clickSection(() => redirect(`/profile?id=${user.id}`))}
                >
                    <div className="brief">
                        <ProfilePic
                            size={2.3}
                            url={user.imgs.profilePic}
                        />
                        <p id='username' >{user.username}</p>
                    </div>
                    <icons.rightArrow className='arrow' />

                </div>
                <div className="section" 
                    onClick={() => clickSection(logout)}
                >
                    <div className="brief">
                        <div className="icon-box">
                            <icons.logout className='icon' />
                        </div>
                        <p> Logout</p>
                    </div>
                    <icons.rightArrow className='arrow' />
                </div>
            </>
        ) : section == 'notifications' ? (
            <>
                <NotificationsWindow
                    handleClick={() => clickSection(() => redirect('/notifications'))}
                />
            </>
        ) : (
            <>
                <p>messages</p>
                <div className="open-section">
                    <p
                        onClick={() => clickSection(() => redirect(`/messages`))}
                    >Go to messages</p>
                </div>
            </>
        )}
    </>
  )
}
