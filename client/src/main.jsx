import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { Route } from 'lucide-react'
import Login from './pages/AuthPage/Login'
import Register from './pages/AuthPage/Register'
import DashBoard from './pages/Dashboard/DashBoard'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/ProfilePage/Profile'
import SwapRequests from './pages/Dashboard/SwapRequests'
import ChatPage from './pages/Message/ChatPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster position="top-center" richColors closeButton />
    <Routes>

      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/swap-requests' element={<SwapRequests />} />
      <Route path='/chat/:receiverId' element={<ChatPage />} />
      <Route path='/profile/:userId' element={<ProfilePage />} />

    </Routes>
  </BrowserRouter>
)
