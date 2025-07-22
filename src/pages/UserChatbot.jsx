import React, { useState } from 'react'
import ChatbotWindow from '../components/ChatbotWindow.jsx';
import ChatbotButton from '../components/ChatbotButton.jsx';

const UserChatbot = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen p-6 bg-gray-100">     
      <div className={`${open ? '' : 'hidden'}`} >
        <ChatbotWindow onClose={() => setOpen(false)} />
      </div>
      <ChatbotButton onClick={() => setOpen(!open)} />
    </div>
  )
}

export default UserChatbot