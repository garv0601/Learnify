import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Profile() {
  return (
    <div>
      <h2 className='text-3xl font-bold mb-7'>Manage your Profile</h2>
      <UserProfile/>
    </div>
  )
}

export default Profile
