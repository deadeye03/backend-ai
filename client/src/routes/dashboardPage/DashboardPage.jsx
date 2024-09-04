import React from 'react'
import './dashboardPage.css'
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Upload from '../../components/upload/Upload';

const DashboardPage = () => {
  const queryClient = new useQueryClient()
  const navigate=useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_LINK}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });
  

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  }
  return (
    <div className='chatpage'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <span>CIMAGE AI</span>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="chat" />
            <span>Create new chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="chat" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/chat.png" alt="chat" />
            <span>Help with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer" onSubmit={handleSubmit}>
        <form >
          
          <input type="text" name="text" placeholder='Ask any thing '/>
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage
