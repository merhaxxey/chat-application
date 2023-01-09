import {Outlet} from 'react-router-dom'
import Footer from '../pages/Footer'

export default function SharedLayoutHome(){
    return <>
        <Outlet />
        <Footer />
    </>
}