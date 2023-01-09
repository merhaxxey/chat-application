import {configureStore} from '@reduxjs/toolkit'
import headerReducer from './features/header/headerSlice.js'
import accountReducer from './features/account/accountSlice.js'
import chatReducer from './features/chat/chatSlice.js'
export const store = configureStore({
    reducer: {
      header: headerReducer,
      account: accountReducer,
      chat: chatReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})
