

import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    email: "",
    name: "",
}

export const userSlice = createSlice({

    name: 'user_info',

    // Initial state Of User data
    initialState: initialStateValue ,

    /**********  Creating Reducers  *********/
    reducers:{
        
        /**** Set Up User Info ****/
        setUserInfo: ( state, action ) => {
            state.email = action.payload.email
            state.name = action.payload.name
        },

        /**** UnSet User Info ****/
        unSetUserInfo: ( state , action ) => {
            state.email = action.payload.email
            state.name = action.payload.name
        },

    }
})

// Export Reducers
export const { setUserInfo, unSetUserInfo } = userSlice.actions

// Export Slice
export default userSlice.reducer