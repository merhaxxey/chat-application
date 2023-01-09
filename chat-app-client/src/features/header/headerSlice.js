import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    isInViewPort: false,
    windowWidth: window.innerWidth
}

const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers:{
        setIsLoading: (state, action)=>{
            state.isLoading = false
        },
        setWindowWidth: (state, action)=>{
            state.windowWidth = window.innerWidth
        },
        setIsInViewPort: (state, action)=>{
            state.isInViewPort = action.payload
        }
    }
})
export default headerSlice.reducer
export const {setIsInViewPort, setWindowWidth} = headerSlice.actions