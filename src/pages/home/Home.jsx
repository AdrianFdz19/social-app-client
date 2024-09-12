import React from 'react'
import './styles/home.scss';
import Feed from './Feed';

export default function Home() {

  return (
    <div className="home-cont">
        <div className="home-box">
            <Feed />
        </div>
    </div>
  )
}
