import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {API_URL} from '../../ApiUrl'
import axios from 'axios'

const initialState = {
    isLoading: true,
    chat: [],
    chatChanged: false,
    curUser: {},
    contact: [],
    people: [],
    contactChanged: false
}

export const getCurrentUserContacts = createAsyncThunk('chat/getCurrentUserContacts', async()=>{
    try {
        const contact = await axios.post(`${API_URL}/api/contact/`,{}, {withCredentials: true})
        return contact
    } catch (error) {
        console.log(error)
    }
})

export const getCurrentUser = createAsyncThunk('chat/getCurrentUser', async()=>{
    try {
        const user = await axios.get(`${API_URL}/api/user/showMe`, {withCredentials: true})
        return user
    } catch (error) {
        console.log(error)
    }
})
export const getAllChat = createAsyncThunk('chat/getAllChat', async(payload)=>{
    try {
        console.log(payload)
        const chat = await axios.post(`${API_URL}/api/chat/all`, payload, {withCredentials: true})
        return chat
    } catch (error) {
        console.log(error)
    }
})

export const getAllUsers = createAsyncThunk('chat/getAllUsers', async()=>{
    try {
        const people = await axios.get(`${API_URL}/api/user/all`, {withCredentials: true})
        return people
    } catch (error) {
        console.log(error)
    }
})


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setIsLoading:(state, action)=>{
            state.isLoading = true
        },
        setContact:(state, action)=>{
            state.contact = action.payload
        },
        setPeople:(state, action)=>{
            state.people = action.payload
        },
        setChatChanged:(state, action)=>{
            state.chatChanged = action.payload
        },
        setChat:(state, action)=>{
            state.chat = action.payload
        },
        setContactChanged:(state, action)=>{
            state.contactChanged = action.payload
        }
    },
    extraReducers:{
        [getCurrentUserContacts.pending]: (state, action)=>{
            state.isLoading = false
        },
        [getCurrentUserContacts.fulfilled]: (state, {payload})=>{
            state.isLoading = true
            state.contact = payload?.data?.contact || []
        },
        [getCurrentUserContacts.rejected]: (state, action)=>{
            state.isLoading = true
        },
        
        [getAllUsers.pending]: (state, action)=>{
            state.isLoading = false
        },
        [getAllUsers.fulfilled]: (state, {payload})=>{
            state.isLoading = true
            state.people = payload?.data?.user || []
        },
        [getAllUsers.rejected]: (state, action)=>{
            state.isLoading = true
        },
        
        [getAllChat.pending]: (state, action)=>{
            state.isLoading = false
        },
        [getAllChat.fulfilled]: (state, {payload})=>{
            state.isLoading = true
            state.chat = payload?.data?.chat || []
        },
        [getAllChat.rejected]: (state, action)=>{
            state.isLoading = true
        },
        
        [getCurrentUser.pending]: (state, action)=>{
            state.isLoading = false
        },
        [getCurrentUser.fulfilled]: (state, {payload})=>{
            state.isLoading = true
            state.curUser = payload?.data?.user || {}
        },
        [getCurrentUser.rejected]: (state, action)=>{
            state.isLoading = true
        }

    }

})

export const {setIsLoading, setContact, setChatChanged, setChat, setPeople, setContactChanged} = chatSlice.actions
export default chatSlice.reducer