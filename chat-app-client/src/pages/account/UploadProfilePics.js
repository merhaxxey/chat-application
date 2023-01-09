import axios from 'axios'
import React,{ useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { API_URL } from '../../ApiUrl'
import { setCurrentUser } from '../../features/account/accountSlice'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './UploadProfilePics.css'

const avartarImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
export default function UploadProfilePics(){
    const {currentUser} = useSelector((store)=> store.account)
    const [image, setImage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSelectPics = (e)=>{
        console.log(e.target.files[0])
        setImage(e.target.files[0])
    }

    const handleChangePics = async(e)=>{
        try{
            if(image){
                const formData = new FormData()
                formData.append('image', image)
                console.log(formData)
                const res = await axios.post(`${API_URL}/api/user/uploadImage`, formData, {withCredentials: true})
                res && navigate('/chat')
            }
            else{
                toast.error('No file provided', {
                    position: 'top-center',
                    autoClose: 4000,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "light"
                })
            }
        }
        catch(error){
            console.log(error)
        }
        
    }
    const handleSkip = async()=>{
        try{
            const res = await axios.patch(`${API_URL}/api/user/`, {profileImage: avartarImage}, {withCredentials: true})
            res && navigate('/chat')
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        axios.get(`${API_URL}/api/user/showMe`, {withCredentials: true})
        .then((res)=>{  
            dispatch(setCurrentUser(res.data.user))
        })
        .catch((error)=>{
            console.log(error)
        })
    }, [])

    return <main className='profilePics-page'>
        <div className='logo'>
            <h3>Reca</h3>
        </div>
        <section className='profilePics-container'>
            <ToastContainer/>
            <div className='image-display'>
                <img 
                    src={
                        currentUser.profileImage ||
                        avartarImage
                    } 
                    alt=''
                    id='image'
                />
            </div>
            <div className='buttons'>
                <input onChange={handleSelectPics} type="file" name='file' />
                <button onClick={handleChangePics}  className='changePics-btn'>Save</button>
                <button onClick={handleSkip} className='skip-btn'>Skip</button>
            </div>
        </section>
    </main>
}