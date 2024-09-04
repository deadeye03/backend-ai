import React, { useState } from 'react'
import './homePage.css'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
function HomePage() {
  const [typingStatus,setTypingStatus]=useState('human1')

  return (
    <div className='homepage'>
      {/* <img src="/orbital.png" alt="orbital" className='orbital' /> */}
      <div className="left">
        <h1>CIMAGE AI</h1>
        <h2>Supercharge your activity and productvity with me </h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident repellendus eius nemo qui! Ea ullam, quaerat, consectetur id nemo commodi quae dolor placeat!</h3>
        <Link to='/dashboard' className='button'>Get start</Link>
      </div>
      <div className="right">
        <div className="imageContainer ">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
            <img src="bot.png" alt="" className='bot'/>
          <div className="chat">
          <img src={typingStatus==='human1'?'/human1.jpeg':typingStatus==='human2'?'/human2.jpeg':'/bot.png'} alt="bot" className="chatBot" />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Human:  Photosynthesis in plants?',
                2000,()=>{setTypingStatus('bot')} ,// wait 1s before replacing "Mice" with "Hamsters"
                'Bot: Sunlight to glucose.',
                2000,()=>{setTypingStatus('human2')},
                'Human: Hubble Space Telescope?',
                2000,()=>{setTypingStatus('bot')},
                'Bot: Universe exploration.',
                2000,()=>{setTypingStatus('human1')}
              ]}
              wrapper="span"
              cursor={true}
              omitDeletionAnimation={true}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
