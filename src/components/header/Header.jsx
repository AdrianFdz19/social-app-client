import React from 'react'
import './styles/header.scss';
import { useAppContext } from '../../context/AppProvider';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePic from '../ProfilePic';
import icons from '../../assets/icons';

export default function Header() {
    const navigate = useNavigate()
    const {user, setUser} = useAppContext();

    const showUserInfo = () => console.log(user);

    const redirect = (route) => navigate(route);

    const logout = () => {
      setUser({});
      localStorage.removeItem('authToken');
      redirect(`/sign-in`);
    };

  return (
    <div className="header-cont">
        <div className="header-box">
            <h3 onClick={()=>redirect(`/`)} >SOCIAL APP</h3>

            <h3 onClick={()=>redirect(`/profile?id=${user.id}`)} >profile</h3>
            {/* <button onClick={showUserInfo} >Show user info</button> */}
            <h3 onClick={logout} >Logout</h3>

            <div className="sections">
              <div className="section">
                <icons.messages className='icon' />
              </div>
              <div className="section mid">
                <icons.notifications className='icon' />
              </div>
              <div className="section" id='profile' >
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
