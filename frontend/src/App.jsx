import React, { useEffect } from 'react'
import { Signup } from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatslice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
const browserRouter=createBrowserRouter([{
  path:"/",
  element:<ProtectedRoutes>
    <MainLayout/>
    </ProtectedRoutes>
    ,
  children:[
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/profile/:id',
      element:<Profile/>
    },
    {
      path:'/account/edit',
      element:<EditProfile/>
    },
    {
      path:'/chat',
      element:<ChatPage/>
    }

  ]
},{
  path:'/login',
  element:<Login/>
},{
  path:'/signup',
  element:<Signup/>
}])
const App = () => {
  const {user}=useSelector
  (store=>store.auth);
  const {socket}=useSelector
  (store=>store.socketio);
  const dispatch=useDispatch()
  useEffect(()=>{
     if(user)
     {
       const socketio=io('http://localhost:8000',{
        query:{
          userId:user?._id,
        },
        transports:['websocket']
       })
       dispatch(setSocket(socketio));

       socketio.on('getOnlineUsers',(onlineUsers)=>{
          dispatch(setOnlineUsers(onlineUsers));
       });
       socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
     });

       return ()=>{
         socketio.close();
         dispatch(setSocket(null));
       }
     }else if(socket){
      socket.close();
      dispatch(setSocket(null));
     }
  },[user,dispatch])
  return (
    <>
   <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
