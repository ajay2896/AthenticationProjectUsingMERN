


import { useEffect, useState } from 'react'
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../services/userAuthApi';
import { getToken, storeToken } from '../../services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../features/authSlice';

const UserLogin = () => {

    // Seeting Error Dynamically
    const [ error, setError ] = useState({
        status: false,
        msg: "",
        type: ""
    })

    // When User Login SuccessFully
    const navigate = useNavigate();

    // Rtk Query Hooks
    const [ loginUser, {isLoading} ] = useLoginUserMutation();

    // When User click "LogIn" Button
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get All Data From Form
        const data = new FormData(e.currentTarget);

        // Get Fields Data When user Enter
        const actualData = {
            email: data.get('email'),
            password: data.get('password')
        }
        
        // If Data Present in Input Field
        if(actualData.email && actualData.password){

            // Call Api's RTK Query Hook
            const res = await loginUser(actualData)
            console.log(res);

            // After Login Then User Direct Redirect Dashboard Page
            // When Success Response From Backend
            if(res.data.status === "success"){
                //After Register Than Store JWT Token Come From Backend
                storeToken(res.data.token)
                // After Registration Then User Redirect to Dashboard Page
                navigate('/dashboard');
            }
            // When Failed Response From Backend
            if(res.data.status === "failed"){
                setError({
                    status: true,
                    msg: res.data.message,
                    type: 'error'
                })
            }
            
        }else{
            setError({ 
                status:true, 
                msg: "All Fields are Required", 
                type:"error" 
            })
        }
    }

    /******  Get Token From Storage  *******/
    let Token = getToken('token');
    // console.log("Get User Token From Local Storage: ", Token );

    // Store Token in Redux Store
    const dispatch = useDispatch();
    useEffect(()=> {
        // Set User Token in Redux Store
        dispatch(setUserToken({
            token: Token
        }))
    }, [ Token, dispatch ]);

  return (
    <>
    {/******** Form **********/}
        <Box component="form" noValidate sx={{ mt:1 }} id="login-form" onSubmit={handleSubmit}>

            {/*****  Email Input Field  ******/}
            <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />

            {/*****  Password Input Field  ******/}
            <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />

            {/*****  Button  ******/}
            <Box textAlign="center">
                {/******** When Loading ******/}
                {
                    isLoading ? <CircularProgress/> : <Button type="submit" variant="contained" sx={{ mt:3 , mb:2, px:5 }} >Login</Button> 
                }
            </Box>

            {/*******  Forget Password Link  ********/}
            <NavLink to="/sendpasswordresetemail" > Forgot Password </NavLink>

            {/*******  show Error  *****/}
            {error.status?<Alert severity={error.type}>{error.msg}</Alert>:""}

        </Box>
    </>
  )
}

export default UserLogin