import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import { useGetAllPost } from '@/hooks/useGetAllPost'
import { useGetSuggestedUsers } from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div>
      <div className='mx-52'>
        <Feed/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Home
