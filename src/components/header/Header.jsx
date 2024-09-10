import React from 'react'
import './styles/header.scss';
import { useAppContext } from '../../context/AppProvider';
import { Link, useNavigate } from 'react-router-dom';

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
            <p onClick={()=>redirect(`/`)} >Header</p>

            <p onClick={()=>redirect(`/profile?id=${user.id}`)} >profile</p>
            {/* <button onClick={showUserInfo} >Show user info</button> */}
            <p onClick={logout} >Logout</p>
        </div>
    </div>
  )
}
