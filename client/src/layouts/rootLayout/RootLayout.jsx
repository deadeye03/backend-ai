import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from 'react-query'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const queryClient = new QueryClient()
 

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
    <div className='rootLayout'>
      <header >
        <Link to='/' className='logo'>
        <img src="/logo.png" alt="logo" />
        <span>Cimage Ai</span>
        </Link>
        <div className="">
        <SignedIn>
        <UserButton />
      </SignedIn>
        </div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
    </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout
