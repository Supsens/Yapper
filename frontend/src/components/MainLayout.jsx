import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import DarkModeToggle from './DarkModeToggle'
import RightSideBar from './RightSideBar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
         <LeftSideBar className="w-1/4 p-4 bg-gray-100 dark:bg-gray-800" />
          <div className="flex-1 p-4">
            <DarkModeToggle/>
            <Outlet/>
          </div>
          <RightSideBar />
    </div>
  )
}

export default MainLayout
