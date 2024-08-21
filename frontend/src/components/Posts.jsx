import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts}=useSelector(store=>store.post);
  return (
    <div className="space-y-4">
      {posts.map((post
      )=><Post key={post._id} post={post}/>)}
    </div>
  )
}

export default Posts
