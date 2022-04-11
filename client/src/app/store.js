


import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import userReducer from '../features/userSlice';
import authReducer from '../features/authSlice';

// Creating Api 
export const store = configureStore({

    reducer:{
        // Add the generated reducer as a specific top-level slice
        [userAuthApi.reducerPath]: userAuthApi.reducer,

        // Store User Data in "user"
        user: userReducer,

        // Store User Token
        userToken: authReducer,
    },

    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)