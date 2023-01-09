import React, {useState, useRef} from 'react'
import {FiSearch} from 'react-icons/fi'
import {GoDeviceCameraVideo} from 'react-icons/go'
import {IoIosArrowBack, IoMdCall} from 'react-icons/io'
import {ImAttachment} from 'react-icons/im'
import {FiSend} from 'react-icons/fi'
import {RiLogoutCircleLine} from 'react-icons/ri'
import {SlArrowDown, SlSocialVkontakte} from 'react-icons/sl'
import {AiOutlineDownload} from 'react-icons/ai'
import Contacts from '../../components/Contacts'
import Call from '../../components/Call'
import People from '../../components/People'
import Welcome from '../../components/Welcome'
import CircularLoading from '../../components/CircularLoading'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {io} from 'socket.io-client'
import {getCurrentUser, getAllUsers, getCurrentUserContacts} from '../../features/chat/chatSlice'

import './Chat.css'
import { API_URL } from '../../ApiUrl'
const avartarImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'

let onElements = false
const Chat = ()=>{
    const chattingWith = useRef(null)
    const curChat = useRef(null)
    const socket = useRef(null)
    const unread = useRef(false)
    const allMessageRef = React.useRef(null)
    const [chatChanged, setChatChanged] = useState(false)
    const [activeConversation, setActiveConversation] = useState(false)
    const [welcome, setWelcome] = useState(true)
    const dispatch = useDispatch()
    const {curUser} = useSelector((store)=> store.chat)
    const [headerBtnName, setHandleHeaderBtn] = useState('chat')
    const [sentOption, setSentOption] = useState(false)
    const [placeCall, setPlaceCall] = useState('')
    const [mobileHide, setMobileHide] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const attachFiles = React.useRef(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [fileInfo, setFileInfo] = useState({name:'', format:''})
    const [message, setMessage] = useState('')
    const [allMessage, setAllMessage] = useState([])
    const [chat, setChat] = useState([])
    const [isLoadingChat, setIsLoadingChat] = useState(true)
    const [activeContactColor, setActiveContactColor] = useState('-1')
    const fileData = useRef(null)
    const handleActivateConversation = async(item)=>{
        curChat.current = item
        chattingWith.current = curUser._id === curChat.current.me._id? curChat.current.you: curChat.current.me
        try {
            const {data} = await axios.post(`${API_URL}/api/message/all`, {id:curUser._id, curChatId: curChat.current._id, to: curChat.current?.you?._id, from: curChat.current.me._id, markAsRead: true}, {withCredentials: true})
            if(data){

                unread.current = false
                setAllMessage(data.message)
                setActiveConversation(true)
                welcome && setWelcome(false)
                placeCall && setPlaceCall('')
                window.innerWidth<593 && setMobileHide(true)
                
                // code to mark all as read
                let tempChat = chat

                tempChat.map((item, index)=>{
                    if(item._id === data.chat._id){
                        tempChat[index] = data.chat
                    }
                })
                curChat.current = data.chat
                console.log(chat)
                setChat(data.allChat)
            }
        } catch (error) {
        }
        allMessageRef.current?.scrollIntoView({behaviour: 'smooth'})
 
    }
    const handlePlaceCall = (value)=>{
        activeConversation && setActiveConversation(false)
        welcome && setWelcome(false)
        setPlaceCall(value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
    }
    const handleHeaderBtn = (name)=>{
        setHandleHeaderBtn(name)
    }
    const handleDeleteMsg = ()=>{

    }
    const cancelPlaceCall = ()=>{
        setActiveConversation(true)
        setWelcome(false)
        setPlaceCall('')
    }

    const handleAttachFile = (e)=>{
        attachFiles.current = e.target.files
        const fileInfo = attachFiles?.current[0]?.name

        if (!fileInfo) return

        let name = fileInfo
        let ext = fileInfo.split('.')[1]
        if(name.length > 20){
            name = `${name.substring(0, 20)}... .${ext}`
        }
        let confirmExt = ''
        if(ext==='jpg' || ext==='jpeg' || ext=== 'png'){
            confirmExt = 'image'
        }
        else if(ext==='mkv' || ext==='mp4'){
            confirmExt = 'video' 
        }
        else if(ext==='mp3' || ext==='wav'){
            confirmExt = 'audio'
        }
        else{
            confirmExt = 'unknown'
        }

        fileData.current = e.target.files[0]
        handleSendMessage({format: confirmExt, message: name})
    }
    const handleDownload = (e)=>{
        setIsDownloading(true)
    }

    const handleSendMessage = async(payload)=>{
        setMessage('')
        try {
            let url
            if(payload.format !== 'text'){
                const formData = new FormData()
                formData.append('file', fileData.current)
                const {data} = await axios.post(`${API_URL}/api/message/uploadFile`, formData, {withCredentials: true})
                if(data){
                   url = data.url
                }
            }
            const {data} = await axios.post(`${API_URL}/api/message/add`, 
            {
                from: curUser._id,
                to: curChat.current.you._id === curUser._id? curChat.current.me._id: curChat.current.you._id,
                message: {
                    format: payload.format,
                    text: payload.format!== 'text'? payload.message: message
                },
                chatId: curChat.current._id,
                fileUrl: url
            },
            {withCredentials: true}
            )
            if(data){
                const projectMessage = {
                    // fromSelf: data.message.sender === curChat.current.me._id,
                    fromSelf: data.message.sender === curUser._id,
                    format: data.message.messages.format,
                    message: data.message.messages.text,
                    updatedAt: data.message.updatedAt,
                    chat: data.message.chat
                }
                socket.current.emit('send-msg', {userId:chattingWith.current._id, projectMessage})
                
                let temp2;
                let tempChat = chat.filter((chat, index)=> chat._id !== curChat.current._id)
                temp2 = [curChat.current, ...tempChat]
                setChat(temp2)
                setAllMessage((prev)=> [...prev, projectMessage])
            }

        } catch (error) {
            console.log(error)
        }        
    }
    const getAllChat = async(payload)=>{
        try {
            const {data} = await axios.post(`${API_URL}/api/chat/all`, payload, {withCredentials: true})
            if(data)
            {
                console.log(data)
                const newArr = [...data.chat]
                setChat(newArr)
                setIsLoadingChat(false)
            }
        } catch (error) {
        }
    }

    useEffect(()=>{
        window.onclick = ()=>{
            !onElements && setOpenModal(false)
        }
        dispatch(getCurrentUserContacts())
        dispatch(getAllUsers())
        dispatch(getCurrentUser())
        socket.current = io('http://localhost:5000')
        socket.current.on('load-msgs', ({userId})=>{
            getAllChat({id: userId})
        })
        socket.current.on('add-to-chat', ()=>{
            console.log('called add-to-chat')
            setChatChanged(true)
        })
        socket.current.on('send-msg', (data)=>{
            setAllMessage(data)
        })

        axios.get(`${API_URL}/api/user/showMe`, {withCredentials: true})
        .then(({data})=>{
            socket.current.emit('add-users', data.user._id)
        })

    }, [])
    useEffect(()=>{
        if(chatChanged){
            // getAllChat({id: curUser._id})
            setChatChanged(false)
        }
    }, [chatChanged])

    useEffect(()=>{
        allMessageRef.current?.scrollIntoView({behaviour: 'smooth'})
    }, [allMessage])

    if(isLoadingChat){
        return <div></div>
    }
    return <main id='chat-page' className='chat-page'>
        {!mobileHide && <section className='chat-contact'>
            <div className="chat">
                <h3 className={`title not-active ${headerBtnName==='contact'? 'active': 'not-active'}`} onClick={()=> handleHeaderBtn('contact')}>contacts</h3>
                <h3 className={`title mid-title ${headerBtnName==='chat'? 'active': 'not-active'}`} onClick={()=> handleHeaderBtn('chat')}>Chat</h3>
                <h3 className={`title not-active ${headerBtnName==='people'? 'active': 'not-active'}`} onClick={()=> handleHeaderBtn('people')}>people</h3>
            </div>
            {headerBtnName === 'chat' && <div className='me-wrapper'>
                <img src={curUser.profileImage} alt='' />
                <div className='user-wrapper'>
                    <span className='user-name'>
                        <span className='name'>You</span>
                        <small className='availability-status'>online</small>
                    </span>
                    <span className='logout-icon'>
                        <RiLogoutCircleLine className='icon'/>
                    </span>
                </div>
            </div>}

            {headerBtnName==='people' && <People socket={socket.current}/>}
            {headerBtnName==='contact' && <Contacts setChatChanged={setChatChanged} chatChanged={chatChanged} socket={socket.current} setActiveContactColor={setActiveContactColor} handleActivateConversation={handleActivateConversation} headerBtnName={headerBtnName} setHandleHeaderBtn={setHandleHeaderBtn}/>}
            {headerBtnName==='chat' && <> <form className='search-form' onSubmit={handleSubmit}>
                <input placeholder='Search contact' type="text" />
                <button type='submit' className='icon-btn'>
                    <FiSearch />
                </button>
            </form>
            <div id='contact-list' className='contact-list'>{
                chat.map((item, index)=>{
                    const unread = !item.read && (item.lastSender != curUser._id)
                    const curUserId = curUser._id === item.me._id? item.you: item.me 
                    const {username, status, profileImage, updatedAt} = curUserId

                    return <div key={index} className={`contact ${activeContactColor===item._id && 'active-contact'}`} 
                        onClick={()=> {
                            setActiveContactColor(item._id)
                            handleActivateConversation(item)
                        }}>
                    <img src={profileImage} alt='' />
                    <div className='info'>
                        <span className='user-name'>
                            <p id='name' className='name'>{username}</p>
                            <span className={`unread-msg ${!unread && 'remove-unread-msg'}`}>{item.unreadCount}</span>
                            <span className={`time ${unread && 'remove-time'}`}>11:15</span>
                        </span>
                        <span className='last-msg'>
                            <p>{status}</p>
                        </span>
                    </div>
                </div>
                })
            }
            </div></>}

        </section>}
        {placeCall && <Call cancelPlaceCall={cancelPlaceCall} callType={placeCall} />}
        {welcome && <Welcome msg={headerBtnName} />}
        {(activeConversation) && <section className={`${(window.innerWidth < 593) && 'mobile-chat-container'} chat-container`}>
            <div className='top-bar'>
                <span className='item1'>
                    {window.innerWidth<593 && 
                        <IoIosArrowBack 
                            style={{
                                padding: '4px',
                                fontSize: '2em',
                                borderRadius: '20px'
                            }}
                            onClick={()=>{
                                setActiveConversation(false)
                                setHandleHeaderBtn('chat')
                                setMobileHide(false)
                            }}
                            className='icon'
                        />} 
                    <img src={chattingWith.current?.profileImage} alt="" />
                    <span>{chattingWith.current?.username}</span>
                </span>

                <span className='item2'>
                    <GoDeviceCameraVideo onClick={()=> handlePlaceCall('video')} className='videoCall-icon'/>
                    <IoMdCall onClick={()=> handlePlaceCall('audio')} className='call-icon'/>
                </span>
            </div>
            <div className='message-space'>
                    <div className='message-space-subWrapper' style={{
                        height: 'max-content',
                    }}>
                        {allMessage.map((msg, index)=>{
                            let d = new Date(msg.updatedAt)
                            d = d.toString()
                            const splittedDate = d.split(' ')
                            let time = splittedDate[4].split(':')
                            time.pop()
                            time = time.join(':')

                            const printableDate = [
                            splittedDate[1],
                            splittedDate[2],
                            time
                            ].join(' ')

                            if(msg.format==='text'){
                                return <div key={index} className={msg.fromSelf?'sent': 'recieved'} >
                                    <span onClick={()=> setSentOption(!sentOption)} className='option'>
                                        <SlArrowDown className='icon'/>
                                        {sentOption && <span className='btns'>
                                            <button type='button' onClick={handleDeleteMsg}>Delete</button>
                                        </span>}
                                    </span>
                                    <div className='message'>
                                        <span className='meta-info'>
                                        {printableDate}
                                        </span>
                                        <p className='actual-message'>{msg.message}</p>
                                    </div>
                                </div>
                            }
                            else{
                                return <div key={index}  className={msg.fromSelf?'sent': 'recieved'}>    
                                    <div className="message">
                                        <span className='meta-info'>{printableDate}</span>
                                        <div id='file-msg' className='file-msg actual-message' >
                                            
                                            <div className='icon-wrapper'>
                                                {isDownloading && <div className='icon working'>
                                                    <CircularLoading />
                                                </div>}
                                                {!isDownloading && <AiOutlineDownload onClick={handleDownload} className='icon download-btn' />}
                                            </div>
                                            <div className='media-info'>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <p className='file-type'>{msg.format} file</p>
                                                    <button type='open'>Open</button>
                                                </div>
                                                <p className='file-name'>{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        })}
                    </div>
            </div>
            <form onSubmit={(e)=>{
                e.preventDefault()
                handleSendMessage({format: 'text'})}
            } 
            className='bottom-bar'>
                <div className='bottom-bar-div'>
                    <div style={{backgroundColor: 'transparent'}} className='attach'>

                        {openModal && <div
                         onMouseOver={()=> onElements = true}
                         onMouseOut={()=> onElements = false} 
                         className='open-file'
                         >
                            <label htmlFor="files">Open file</label>
                            <input id='files' type="file" onChange={handleAttachFile} placeholder='open file'/>
                        </div>}
                        <ImAttachment onClick={()=> {
                            setOpenModal(true)
                        }}
                        onMouseOver={()=> onElements = true}
                        onMouseOut={()=> onElements = false}
                        style={{backgroundColor: 'transparent'}}
                        className='icon'/>
                    </div>
                    <div className='input-wrapper'>
                        <input name='sendMessage' value={message} onChange={(e)=> setMessage(e.target.value)} type="text" />
                    </div>
                    <button className='send-msg-btn' type='submit'>
                        <FiSend className='icon'/>
                    </button>
                </div>
            </form>
        </section>}

    </main>
}
export default Chat