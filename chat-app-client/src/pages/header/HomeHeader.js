import React from 'react'
import {Link} from 'react-router-dom'
import './HomeHeader.css'

export default function Header(){
    return <main className='homeheader'>
        <div className='logo'>
            <h3>Reca</h3>
        </div>
        <div id='buttons' className='buttons'>
            <Link to='/about-us'>
                <span>About us</span>
            </Link>
            <Link to='/login'>
                <span>Login</span>
            </Link>
            <Link to='/signup'>
                <span>Sign Up</span>
            </Link>
        </div>
    </main>
}