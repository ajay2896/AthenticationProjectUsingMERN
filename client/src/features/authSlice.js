

import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    token: null,
}

export const authSlice = createSlice({

    name: 'auth_token',

    // Initial state Of User data
    initialState: initialStateValue ,

    /**********  Creating Reducers  *********/
    reducers:{
        
        /**** Set Up User Info ****/
        setUserToken: ( state, action ) => {
            state.token = action.payload.token
        },

        /**** UnSet User Info ****/
        unSetUserToken: ( state , action ) => {
            state.token = action.payload.token
        },

    }
})

// Export Reducers
export const { setUserToken, unSetUserToken } = authSlice.actions

// Export Slice
export default authSlice.reducer