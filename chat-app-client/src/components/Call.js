import React,{ useEffect, useState } from 'react'
import { FiPhoneCall } from 'react-icons/fi'
import { ImPhoneHangUp } from 'react-icons/im'
import { IoIosCall } from 'react-icons/io'
import {MdCancel} from 'react-icons/md'
import styled from 'styled-components'

export default function Call({cancelPlaceCall}){
    const [stream, setStream] = useState(null)
    const myVideo = React.useRef(null)
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream)=>{
            setStream(stream)
            myVideo.current.srcObject = stream
        })
    }, [])
    return <Container className={`${(window.innerWidth < 593) && 'mobile-chat-container'} chat-container call-modal`}>
        <section>
            <MdCancel onClick={()=>{
                myVideo.current.srcObject?.getTracks()?.forEach(function(track) {
                        track.stop();
                    })
                    cancelPlaceCall()
                }}
                className='cancel-icon'
            />
            <video playsInline muted autoPlay ref={myVideo}></video>
              <div className='btns'>
                <button className='phoneHangUp'>
                    <ImPhoneHangUp  className='icon' />
                    <span>Hang up</span>
                </button>
                <button className='incoming-call'>
                    <FiPhoneCall className='icon ' />
                    <span>incoming call</span>
                </button>
                <button className='call'>
                    <IoIosCall className='icon' />
                    <span>calling</span>
                </button>
            </div>
        </section>
   </Container> 
}

const Container = styled.section`
    background-color: rgba(64, 110, 207, .5);
    section{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .cancel-icon{
            position: absolute;
            top: 0;
            right: 0;
            color: red;
            font-size: 1.8em;
        }
        video{
            height: 300px;
            width: 270px;
        }
        .btns{
            display: flex;
            button{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 50px;
                width: 100px;
                background-color: transparent;
                border: 0;
                .icon{
                    font-size: 1.9em;
                }
            }
            :focus{
                outline: none;
            }
            .call{
                color: green;
            }
            .phoneHangUp{
                color: red;
            }
            .incoming-call{
                color: blue;
            }
        }
    }
` 