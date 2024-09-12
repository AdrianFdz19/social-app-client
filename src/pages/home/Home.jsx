import React, { useEffect } from 'react'
import './styles/home.scss';
import Feed from './Feed';
import { useAppContext } from '../../context/AppProvider';

export default function Home() {

  const {isMobile} = useAppContext();

  return (
    <div className="home-cont">
        <div className="home-box">
            <Feed />
        </div>
    </div>
  )
}
