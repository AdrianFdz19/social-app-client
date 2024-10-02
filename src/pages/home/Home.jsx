import React, { useEffect } from 'react'
import './styles/home.scss';
import Feed from './Feed';
import { useAppContext } from '../../context/AppProvider';
import { useSocket } from '../../context/SocketProvider';

export default function Home() {

  const {isMobile} = useAppContext();
  const socket = useSocket();

  return (
    <div className="home-cont">
        <div className="home-box">
            <Feed
              socket={socket}
            />
        </div>
    </div>
  )
}
