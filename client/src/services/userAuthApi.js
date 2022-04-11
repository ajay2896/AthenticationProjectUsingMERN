

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a Service Using a Bse URL and Endspoints
export const userAuthApi = createApi({

    // Path of API
    reducerPath: 'userAuthApi',

    // Base URL
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/user/'
    }),

    /************** Endpoints oF Base URL **********/
    endpoints: (builder) => ({

        /***** User Register Endpoinnt *****/
        registerUser: builder.mutation({
            query: (user) => {
                return({
                    url:'register' ,
                    method: 'POST' ,
                    body: user ,
                    headers:{
                        'Content-type':'application/json' ,
                    }
                })
            }
        }),

        /***** User LogIn Endpoinnt *****/
        loginUser: builder.mutation({
            query: (user) => {
                return({
                    url: 'login' ,
                    method: 'POST' ,
                    body: user ,
                    headers:{
                        'Content-type':'application/json' ,
                    }
                })
            }
        }),

        /******  Sent Password Reset Link to  Email Endpoint  *******/
        sendPasswordResetEmail: builder.mutation({
            query: (user) => {
                return({
                    url: 'send-reset-password-email',
                    method: 'POST',
                    body: user ,
                    headers:{
                        'Content-type': 'application/json',
                    }
                })
            }
        }),

        /******   Reset Password OF User Email Endpoint  *******/
        resetPassword: builder.mutation({
            query: ({ actualData, id, token}) => {
                return({
                    url: `reset-password/${id}/${token}`,
                    method: 'POST',
                    body: actualData,
                    headers:{
                        'Content-type': 'application/json',
                    }
                })
            }
        }),

        /******   Get LogIn User Data Endpoint  *******/
        getLoggedUserData: builder.query({
            query: (token) => {
                return({
                    url: `loggeduser`,
                    method: 'GET',
                    headers:{
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
        }),

        /****** Chnage Password After User Login Endpoint  *******/
        changeUserPassword: builder.mutation({
            query: ({actualData,token}) => {
                return({
                    url: 'changepassword',
                    method: 'POST',
                    body: actualData ,
                    headers:{
                        'authorization': `Bearer ${token}`,
                    }
                })
            }
        }),

    })

})


/******  Export ooks For Usage in Functional Components Which are auto-genrated based on the defined endpoints  *******/
export const { 
    useRegisterUserMutation ,
    useLoginUserMutation ,
    useSendPasswordResetEmailMutation ,
    useResetPasswordMutation ,
    useGetLoggedUserDataQuery ,
    useChangeUserPasswordMutation
} = userAuthApi;