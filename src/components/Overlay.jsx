import React from 'react'
import './styles/overlay.scss'

export default function Overlay({children}) {
  return (
    <div className="overlay">
        {children}
    </div>
  )
}
