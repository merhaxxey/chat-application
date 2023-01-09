import React, {useState, useEffect} from 'react'
import {BsFacebook} from 'react-icons/bs'
import Alert from '@mui/material/Alert'
import {FcGoogle} from 'react-icons/fc'
import {useNavigate} from 'react-router-dom'
import { API_URL } from '../../ApiUrl'
import { useDispatch } from 'react-redux'
import Footer from '../Footer'
import axios from 'axios'
import { setCurrentUser } from '../../features/account/accountSlice'
import './Signup.css'

export default function Signup(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [values, setValues] = useState({name: '', username: '', password: ''})
    const [formError, setFormError] = useState({name: '', username: '', password: ''})
    const [serverError, setServerError] = useState('')

    const handleInputChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value})
        setFormError({...formError, [e.target.name]: ''})
    }
    function validateForm(){
        const {name, username, password} = values
        let temp = {name: '', username: '', password: ''}
        let isValid = true
        if(!name){
            temp = {...temp, name:'*field is required'}
            isValid = false
        }
        else if(name.length < 3){
            temp = {...temp, name:'name must contain more than 2 characters'}
            isValid = false
        }

        if(!username){
            temp = {...temp, username:'*field is required'}
            isValid = false
        }
        else if(username.length < 5){
            temp = {...temp, username:'username must contain more than 4 characters'}
            isValid = false
        }

        if(!password){
            temp = {...temp, password:'*field is required'}
            isValid = false
        }
        else if(password.length < 7){
            temp = {...temp, password:'password must contain more than 6 characters'}
            isValid = false
        }
        if(!isValid){
            setFormError(temp)
        }
        return isValid
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(!validateForm()) return
        
        try{
            const {data} = await axios.post(`${API_URL}/api/auth/register/`, values, {withCredentials:true})
            if(data){
                dispatch(setCurrentUser(data.user))
                navigate('/profilePics')
            }
        }
        catch(error){
            if(error.response.status === 404){
                setServerError('Username is already taken')
            }
            else{
                setServerError('Something went wrong, please try again later')
            }
        }
    }

    useEffect(()=>{
        if(serverError){
            setTimeout(()=>{
                setServerError('')
            }, 10000)
        }
    }, [serverError])

    return <main className='signup-page-container'>
        <section className='signup-page'>
            <div className='logo'>
                <h3>Reca</h3>
            </div>
            <form onSubmit={handleSubmit} className="input-wrapper">
                <h2 className='create-account'>Create Account</h2>
                {serverError && <Alert severity="error">{serverError}</Alert>}
                <div className='input'>
                    <input placeholder='Full name' name='name' type="text" value={values.name} onChange={handleInputChange}/>
                    {formError.name && <small>{formError.name}</small>}
                </div>
                <div className='input'>
                    <input placeholder='Username' name='username' type="text" value={values.username} onChange={handleInputChange}/>
                    {formError.username && <small>{formError.username}</small>}
                </div>
                <div className='input'>
                    <input placeholder='Password' name='password' type="password" value={values.password} onChange={handleInputChange}/>
                    {formError.password && <small>{formError.password}</small>}
                </div>

                <button type='submit'>Create Account</button>
                <div className="icons">
                    <BsFacebook className='f-icon'/>
                    <FcGoogle className='g-icon'/>
                </div>
                <button onClick={()=> navigate('/login')} id='signin-btn' type='button'>Sign In</button>
            </form>
        </section>
        <Footer></Footer>
    </main>
}