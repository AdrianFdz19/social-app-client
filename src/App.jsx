import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import NestedRoute from './components/NestedRoute'
import LayerWithHeader from './components/LayerWithHeader'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Messages from './pages/messages/Messages'

function App() {

  return (
    <>
      <div className="App">
        <Routes>

          <Route element={<NestedRoute />} >

            <Route path='/' element={<LayerWithHeader />} >

              <Route index element={<Home />} ></Route>

              <Route path='/profile' element={<Profile />} ></Route>

              <Route path='/messages' element={<Messages />} ></Route>

            </Route>

          </Route>

          <Route path='/sign-up' element={<SignUp />} ></Route>

          <Route path='/sign-in' element={<SignIn />} ></Route>

        </Routes>
      </div>
    </>
  )
}

export default App
