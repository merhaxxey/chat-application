import axios from 'axios'
import { useEffect } from 'react'
import {FiSearch} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from '../ApiUrl'
import { getCurrentUserContacts, setContact, setContactChanged } from '../features/chat/chatSlice'
import './Contact.css'

export default function Contacts({chatChanged, setChatChanged, socket, setActiveContactColor, setHandleHeaderBtn, handleActivateConversation}){
    const dispatch = useDispatch()
    const {contact, contactChanged, curUser} = useSelector((store)=> store.chat)
    
    const handleSubmit = (e)=>{
        e.preventDefault()
    }
    const handleAddToChat = async(index)=>{
        const to = contact[index].me._id === curUser._id? contact[index].you._id: contact[index].me._id
        const {data} = await axios.post(`${API_URL}/api/chat/create`, {
            you: to, youUsername: contact[index].youUsername, contactId: contact[index]._id
        }, {withCredentials: true})

        if(data){
            handleActivateConversation(data.chat)
            setChatChanged(true)
            setActiveContactColor(contact[index]._id)
            setHandleHeaderBtn('chat')
            // handleActivateConversation(contact[index])
            const chattingWith = curUser._id === data.chat.me._id? data.chat.you._id: data.chat.me._id
            socket.emit('add-to-chat', chattingWith)
        }
    }
    useEffect(()=>{
        socket.on('add-to-contact', (contact)=>{
            dispatch(setContactChanged(true))
        })
    }, [])
    useEffect(()=>{
        if(contactChanged){
            dispatch(getCurrentUserContacts())    
            dispatch(setContactChanged(false))
        }
    }, [contactChanged])

    if(!contact){
        return <h4>loading</h4>
    }
    return <div className='contact-component'>
        <form className='search-form' onSubmit={handleSubmit}>

            <input placeholder='Search contact' type="text" />
            <button type='submit' className='icon-btn'>
                <FiSearch />
            </button>
        </form>
        <div id='contact-list' className='contact-list'>{contact.map((item, index)=>{   
            const curUserId = curUser._id === item.me._id? item.you: item.me 
            const {username, status, profileImage, updatedAt} = curUserId

            return <div key={index} onClick={()=> handleAddToChat(index)} className='contact'>
                <img src={profileImage} alt='' />
                <div className='info'>
                    <span className='user-name'>
                        <p id='name' className='name'>{username}</p>
                        <span className='time'></span>
                    </span>
                    <span className='last-msg'>
                        <p>{status}</p>
                    </span>
                </div>
            </div>
        })}

        </div>
    </div>
}