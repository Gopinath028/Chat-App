import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import { Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext.jsx'

const App = () => {

  const {authUser} = useContext(AuthContext)
 console.log("authUser:", authUser);
  return (
    <div className='bg-[url("/bgImage.svg")] bg-cover bg-center min-h-screen'>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App