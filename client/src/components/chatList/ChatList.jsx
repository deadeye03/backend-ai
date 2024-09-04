import React from 'react'
import './chatList.css'
import { Link } from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

function ChatList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_LINK}/api/userChats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });
  console.log(data)

  return (
    <div className='chatlist'>
      <p className="dashboard title">DASHBOARD</p>
      <div className="feature">
        <Link to='/dashboard'>Create a new chat</Link>
        <Link to='/'>Explore Cimage AI</Link>
        <Link to='/'>Contact</Link>
      </div>
      <hr />
      <div className="title">RECENT CHATS</div>
      <div className="list">
        {isPending?"Loading...":error?"something went wrong":data?.map((chat)=>(
          <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
        ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  )
}

export default ChatList
