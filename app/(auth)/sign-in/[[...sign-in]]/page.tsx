import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
   <main className='auth-page'>
    <SignIn/>
    <p>sign in</p>
   </main>
  )
}

export default SignInPage