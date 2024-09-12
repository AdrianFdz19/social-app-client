import React from 'react'
import './styles/profilepic.scss';
import icons from '../assets/icons';

export default function ProfilePic({url, size = 5, outline = false, handleClick, isOnline}) {
  return (
    <div className={`profile-pic-cont ${outline ? 'outline' : ''}`}
        style={{width: `${size}rem`, height: `${size}rem`}}
        onClick={handleClick}
    >
        <div className="profile-pic-box">
            {url ? (
                <img src={url} alt="profile_pic_url" />
            ) : (
                <icons.guestIcon id='icon' />
            )}

        </div>

        {isOnline &&
            <div className="online-mark"></div>
        }

    </div>
  )
}
