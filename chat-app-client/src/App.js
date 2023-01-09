import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homepage from './pages/home/Homepage'
import Header from './pages/header/Header'
import Login from './pages/account/Login'
import Signup from './pages/account/Signup'
import UploadProfilePics from './pages/account/UploadProfilePics.js'
import SharedLayoutHome from './shared_layout/SharedLayoutHome'
import { useSelector } from 'react-redux'
import Chat from './pages/Chat/Chat'
import './App.css'

export default function App(){
    const {isInViewPort} = useSelector((store)=> store.header)

    return <BrowserRouter>
        <Routes>
            <Route path='/' element={<SharedLayoutHome/>}>
                <Route index element={
                <>
                    {!isInViewPort && <Header /> }
                    <Homepage/>
                </>
                }></Route>

                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />
                <Route path='profilePics' element={<UploadProfilePics />} />
            </Route>
            <Route path='chat' element={<Chat />} />
        </Routes>
    </BrowserRouter>
}