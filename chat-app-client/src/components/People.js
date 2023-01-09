import React,{useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import { AiOutlinePlus  } from 'react-icons/ai'
import CircularLoading from './CircularLoading'
import { FcCheckmark } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from '../ApiUrl'
import axios from 'axios'
import './People.css'
import { setContact, setPeople, setContactChanged } from '../features/chat/chatSlice'

export default function People({socket}){
    const dispatch = useDispatch()
    const [addToContact, setAddToContact] = useState(false)
    const {people} = useSelector((store)=> store.chat)
    const [loading, setLoading] = useState(false)
    const [addedToContact, setAddedToContact] = useState(false)
    const peopleListRef = React.useRef(null)
    
    const handleSubmit = (e)=>{
        e.preventDefault()
    }
    const handlePeopleSelect = async(index)=>{      
        const list =  peopleListRef.current.children[index].classList
        list.add('addingToContact-loading')
        list.add('addToContact')
        try{
            const {data} = await axios.post(
                `${API_URL}/api/contact/create`, 
                {
                    youId: people[index]._id,
                    username: people[index].username
                },
                {withCredentials: true}
            )
            if(data){
                console.log(data)
                list.remove('addingToContact-loading')
                list.add('addedToContact')
                
                dispatch(setContactChanged(true))
                socket.emit('add-to-contact', {contact:data.contact})
                // dispatch(setPeople(data.people))
            }
        }catch(error){
            list.remove('addedToContact')
            list.remove('addingToContact-loading')
            list.remove('addToContact')
            console.log(error)
        }
    }

    return <div className='contact-component people-modal'>
        <form className='search-form' onSubmit={handleSubmit}>
            <input placeholder='Search contact' type="text" />
            <button type='submit' className='icon-btn'>
                <FiSearch />
            </button>
        </form>
        <div id='contact-list' className='contact-list' ref={peopleListRef}>{
            
            people.map((item, index)=>{
                const {username, profileImage, status, added} = item
                 return <div key={index} className={`${added && 'addedToContact addToContact'} contact`}>
                    <img src={profileImage} alt='' />
                    <div className='info'>
                        <span className='user-name'>
                            <p id='name' className='name'>{username}</p>
                            <span className='add-to-contact'>
                                <AiOutlinePlus onClick={()=> handlePeopleSelect(index)} className='plus-icon'/>
                                <CircularLoading className='circular-loading'/>
                                <FcCheckmark className='mark-icon' />
                            </span>
                        </span>
                        <span className='last-msg'>
                            <p>{status}</p>
                        </span>
                    </div>
                </div>
            })
        }
        </div>
    </div>
}