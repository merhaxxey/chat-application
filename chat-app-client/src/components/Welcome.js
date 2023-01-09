import React from 'react'
import './Welcome.css'

export default function Welcome({msg}){
    return <section className='chat-container chat-welcome-msg'>
        {msg === 'chat' && <h1>Welcome, Please select a chat to start conversation</h1>}
        {msg === 'people' && <h1>Find people to make friends with, add them to contact and start messaging them</h1>}
        {msg === 'contact' && <h1>Welcome, Please select a contact to start messaging</h1>}
    </section>
}