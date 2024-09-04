import { useAuth } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import './dashboardLayot.css'
import { Outlet, useNavigate } from 'react-router-dom'
import ChatList from '../../components/chatList/ChatList';

function DashboardLayout() {
  const {userId, isLoaded}=useAuth();
  const navigate=useNavigate()

  useEffect(()=>{
      if (isLoaded && !userId) {
        navigate('/sign-in')
      }
  },[userId,isLoaded,navigate])
  if(!isLoaded) return "Loading....."
  return (
    <div className='dashboardLayout'>
      <div className="menu">
        <ChatList/>
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  )
}

export default DashboardLayout
