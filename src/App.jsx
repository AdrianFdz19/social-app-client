import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import SignUp from './pages/auth/SignUp'

function App() {

  return (
    <>
      <div className="App">
        <Routes>

          <Route path='/sign-up' element={<SignUp />} ></Route>

          <Route path='/sign-in' element={<SignUp />} ></Route>

        </Routes>
      </div>
    </>
  )
}

export default App
