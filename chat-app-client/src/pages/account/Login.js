import React, {useState, useEffect} from 'react'
import {BsFacebook} from 'react-icons/bs'
import {useNavigate} from 'react-router-dom'
import {FcGoogle} from 'react-icons/fc'
import { API_URL } from '../../ApiUrl'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../features/account/accountSlice'
import './Signup.css'

export default function Login(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [values, setValues] = useState({username: '', password: ''})
    const [formError, setFormError] = useState({username: '', password: ''})
    const [serverError, setServerError] = useState('')

    const handleInputChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value})
        setFormError({...formError, [e.target.name]: ''})
    }
    function validateForm(){
        const {username, password} = values
        let temp = {username: '', password: ''}
        let isValid = true
        if(!username){
            temp = {...temp, username:'*field is required'}
            isValid = false
        }
        if(!password){
            temp = {...temp, password:'*field is required'}
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
            const {data} = await axios.post(`${API_URL}/api/auth/login/`, values, {withCredentials:true})
            if(data){
                if(!data.user.profileImage){
                    dispatch(setCurrentUser(data.user))
                    return navigate('/profilePics')
                }
                navigate('/chat')
            }
        }
        catch(error){
            if(error.response.status === 404){
                setServerError('Invalid username or password')
            }
            else if(error.response.status === 400){
                setServerError('Invalid credentials')
            }
            else if(error.response.status === 401){
                setServerError('invalid credentials')
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
                <h2 className='create-account'>Login to your account</h2>
                {serverError && <Alert severity="error">{serverError}</Alert>}
                <div className='input'>
                    <input placeholder='Username' name='username' type="text" value={values.username} onChange={handleInputChange}/>
                    {formError.username && <small>{formError.username}</small>}
                </div>
                <div className='input'>
                    <input placeholder='Password' name='password' type="password" value={values.password} onChange={handleInputChange}/>
                    {formError.password && <small>{formError.password}</small>}
                </div>

                <button type='submit'>Login</button>
                <div className="icons">
                    <BsFacebook className='f-icon'/>
                    <FcGoogle className='g-icon'/>
                </div>
                <button onClick={()=> navigate('/signup')} id='signin-btn' type='button'>Sign Up</button>
            </form>
        </section>
    </main>
}