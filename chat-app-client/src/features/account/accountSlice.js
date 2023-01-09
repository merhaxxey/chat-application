import {createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    currentUser: {}
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers:{
        setCurrentUser: (state, action)=>{
            state.currentUser = action.payload
        }
    }
})

export default accountSlice.reducer
export const {setCurrentUser} = accountSlice.actions