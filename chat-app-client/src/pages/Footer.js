import {CgFacebook} from 'react-icons/cg'
import {RiLinkedinLine} from 'react-icons/ri'
import {RiTwitterLine} from 'react-icons/ri'

export default function Footer(){
    return <section className='footer'>
        <p>Copyright 2022 @ reca.com</p>
        <span className='icons'>
            <a className='icon facebook' href="https://web.facebook.com/profile.php?id=100007844115375">
                <CgFacebook />
            </a>
            <a className='icon linkedin' href="https://www.linkedin.com/in/dauda-abdulrazaq-a95b5824b/">
                <RiLinkedinLine />
            </a>
            <a className='icon twitter' href="https://twitter.com/razi_blac">
                <RiTwitterLine />               
            </a>
        </span>
    </section>

}