


import { useState } from 'react'
import { TextField, Button, Box, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi.js';

import { storeToken } from '../../services/LocalStorageService'

const Registration = () => {

    // Seeting Error Dynamically
    const [ error, setError ] = useState({
        status: false,
        msg: "",
        type: ""
    }) 

    // When User Login SuccessFully
    const navigate = useNavigate();

    // Fetch Data Using Rtk Query HOOKs
    const [ registerUser, { isLoading } ] = useRegisterUserMutation();

    // When User click "LogIn" Button
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Get All Data From Form
        const data = new FormData(e.currentTarget);
        // Get Fields Data When user Enter
        const actualData = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation'),
            tc: data.get('tc')
        }
        
        // If Data Present in Input Field
        if(actualData.name && actualData.email && actualData.password && actualData.tc !== null ){

            // Check Password Confirm OR Not
            if(actualData.password === actualData.password_confirmation){
                
                // Pass Form Data to Backend
                const res = await registerUser(actualData);
                console.log(res);
                
                // When Success Response From Backend
                if(res.data.status === "success"){
                    //After Register Than Store JWT Token Come From Backend
                    storeToken(res.data.token)
                    // After Registration User Redirect to Dashboard Page
                    navigate('/dashboard')
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
                    status: true,
                    msg: "Password and confirm Password Doesn't Match",
                    type: "error"
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

  return (
    <>
    {/******** Form **********/}
        <Box component="form" noValidate sx={{ mt:1 }} id="registration-form" onSubmit={handleSubmit}>

            {/*******  Name Input Field ******/}
            <TextField margin="normal" required fullWidth id="name" name="name" label="Name" />

            {/*****  Email Input Field  ******/}
            <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />

            {/*****  Password Input Field  ******/}
            <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />

            {/*****  Confirm Password Input Field  ******/}
            <TextField margin="normal" required fullWidth id="password_confirmation" name="password_confirmation" label="Confirm Password" type="password" />

            {/******* Term & Condition Checkbox  ******/}
            <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to term and condition"/>

            {/*****  Button  ******/}
            <Box textAlign="center">
                <Button type="submit" variant="contained" sx={{ mt:3 , mb:2, px:5 }} > Register </Button>
            </Box>

            {/*******  show Error  *****/}
            {error.status?<Alert severity={error.type}>{error.msg}</Alert>:""}

        </Box>
    </>
  )
}

export default Registration