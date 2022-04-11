



import React, { useState , useEffect } from 'react'
import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './auth/ChangePassword';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useGetLoggedUserDataQuery } from '../services/userAuthApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, unSetUserInfo } from '../features/userSlice';
import { unSetUserToken } from '../features/authSlice';

const Dashboard = () => {

    // Creating Navigate user Using "useNavigate" Hook's
    const navigate = useNavigate();

    // When Logout button Click Then User Was Logout
    const handleLogout = () => {

        // Unset User Data After User Logout
        dispatch(unSetUserInfo({
            email:"",
            name: "",
        }))

        // Unset Token After User Logout
        dispatch(unSetUserToken({
            token: null
        }))

        // After Logout Then Remove JWT Token From Local Storage
        removeToken('token')

        // When user Logout then User Redirect to Login Page
        navigate('/login')
    }

    // Get Token From Local Storage
    const token = getToken();
    // console.log("User Token From Dashboard: ",token)

    // Get RTK Query Hooks For Call Backend API & Pass Token
    const { data, isSuccess } = useGetLoggedUserDataQuery(token);

    /*********  Store User Data in Redux Store **********/
    // Dispatch Use For store Data in Redux
    const dispatch = useDispatch()

    // "useSelector" use for Getting data from Redux Store
    const userData = useSelector( (state) => state.user )

    // Creating "useEffect" For Store user Data in Redux Store
    useEffect(() => {
        if( data && isSuccess ){
            // Store Data into Redux
            dispatch(setUserInfo({
                email: data.user.email,
                name: data.user.name
            }))
        }
    }, [ data, isSuccess, dispatch ])


  return (
    <>
        <CssBaseline />
        <Grid>
            <Grid item sm={4} sx={{backgroundColor:'gray', p:5, color:'white' }} >

                <h1>Dashboard</h1>

                {/*********  Email OF User Login  **********/}
                <Typography variant='h5' >Email: {userData.email}</Typography>

                {/**********  Name OF User Login  ********/}
                <Typography variant='h6'>Name: {userData.name} </Typography>

                {/********  Button Click *****/}
                <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt:8 }}>Logout</Button>
            </Grid>
            <Grid item sm={8}>
                <ChangePassword/>
            </Grid>
        </Grid>
    </>
  )
}

export default Dashboard