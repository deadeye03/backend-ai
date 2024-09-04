import React from 'react'
import './signinPage.css'
import { SignIn } from '@clerk/clerk-react'
function signinPage() {
  return (
    <div className='signInPage'>
     <SignIn path="/sign-in" signUpUrl='/sign-up' forceRedirectUrl='/dashboard'/>
    </div>
  )
}

export default signinPage


