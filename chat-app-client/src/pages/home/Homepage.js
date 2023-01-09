import React, {useEffect, useRef} from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import HomeHeader from '../header/HomeHeader'
import { setIsInViewPort } from '../../features/header/headerSlice'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import './Homepage.css'

export default function Homepage(){
    const view1Wrapper = useRef(null)
    const dispatch = useDispatch()
    const {isInViewPort} = useSelector((store)=> store.header)
    const navigate = useNavigate()

    const temp = useIsInViewport(view1Wrapper)

    useEffect(()=>{
        dispatch(setIsInViewPort(temp))
        console.log(isInViewPort)
    }, [temp])

    const handleSignup = ()=>{
        navigate('/signup')
    }

    return <main className='homepage' >
        <section className='view1-wrapper' ref={view1Wrapper}>
            <HomeHeader/>
            <section className='view1 landing-view'>
                <div className='welcome-quotes'>
                    <p className='quote1'>Chatting can't just be made more easier than it is on RECA </p>
                    <p className='quote2'>We provide a seamless fast and secure chatting platform that connect you with friends, families and others </p>
                    <button onClick={handleSignup} className='signup-btn'>Sign Up</button>
                </div>
                <div className="phone-chat">
                    {/* <img src="https://res.cloudinary.com/dswxrlrm6/image/upload/v1671803674/chat-app-images/phone-chat_a6axru.jpg" alt="phone-chat-app" /> */}
                </div>
            </section>
        </section>
        <section className='view2 video-calling-view'>
            <article className='title'>
                <h2>Visual Chat</h2>
                <hr />
            </article>
            <article className='content'>
                <div className='quote'>
                    <p className='quote1'>Make chating visual with our video calling feature</p>
                    <p className='quote2'>You can make video call with one person to a mazimum of 7 persons</p>
                </div>
                <div className="images">
                    <img className='image1' src="https://energyresourcing.com/wp-content/uploads/2022/07/look-your-best-on-video-call.jpg" alt="phone-chat-app" />
                </div>
            </article>
        </section>
        <section className='view3 share-files-view'>
            <article className='title'>
                <h2>Send files</h2>
                <hr />
            </article>
            <article className='content'>
                <div className="images">
                    <img className='image1' src="https://image-us.samsung.com/SamsungUS/support/solutions/mobile/phones/galaxy-s/s21/PH_S21-Share-files-from-your-galaxy-phone-or-tablet.png?$default-high-resolution-jpg$" alt="share files" />
                </div>
                <div className='quote'>
                    <p className='quote1'>Share documents and media with people during chatting</p>
                    <p className='quote2'>Share voice notes, images, video record and importand documents</p>
                </div>
            </article>
        </section>
     </main>
}

const useIsInViewport = (ref)=>{
    const [isIntersecting, setIsIntersecting] = useState(false)

    const observer = useMemo(()=>{
        return new IntersectionObserver(([entry])=>{
            return setIsIntersecting(entry.isIntersecting)
        })
    }, [])

    useEffect(()=>{
        observer.observe(ref.current)

        return ()=> observer.disconnect()
    }, [ref, observer])

    return isIntersecting
}