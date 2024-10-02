import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom'
import AppProvider from './context/AppProvider.jsx'
import ChatProvider from './context/ChatProvider.jsx'
import SocketProvider from './context/SocketProvider.jsx'
import NotificationsProvider from './context/NotificationsProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AppProvider>
      <SocketProvider>
        <NotificationsProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </NotificationsProvider>
      </SocketProvider>
    </AppProvider>
  </Router>
)
