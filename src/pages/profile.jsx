import React from 'react'
import Header from '../components/header.jsx'
import Profile from '../components/profile/index.jsx'
import { useParams } from 'react-router-dom'

export default function ProfilePage() {
  const { authId} = useParams();
  
  return (
    <>
      <Header />
      <Profile authId={authId} />
    </>
  )
}
