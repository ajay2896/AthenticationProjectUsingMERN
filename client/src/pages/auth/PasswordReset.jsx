



import { useState , } from 'react';
import { Grid, TextField, Button, Box, Alert } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../services/userAuthApi';

const PasswordReset = () => {

    // Navigate User
    const navigate = useNavigate();

    // Seeting Error Dynamically
    const [ error, setError ] = useState({
        status: false,
        msg: "",
        type: ""
    })

    // Get Function From RTK Query Hook To Pass ID,Token
    const [ resetPassword, {} ] = useResetPasswordMutation();

    // Get ID , Token From "useParams"
    const {id, token} = useParams();

    // When User click "LogIn" Button
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Get All Data From Form
        const data = new FormData(e.currentTarget);

        // Get Fields Data When user Enter
        const actualData = {
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation')
        }
        
        // If Data Present in Input Field
        if(actualData.password && actualData.password_confirmation){

            if(actualData.password === actualData.password_confirmation){

                // Call Function OF Rtk Query Hook API
                const res = await resetPassword({ actualData, id, token })
                console.log(res);

                if(res.data.status === "success"){
                    // If User submit after reset Fields Form
                    document.getElementById('password-reset-form').reset();
                    // Send SuccessFully Message
                    setError({ 
                        status:true, 
                        msg: "Password Reset SuccessFully, Redirect to Login Page...", 
                        type:"success" 
                    })
                    // After Submit Password Reset User Redirect to Login Page
                    setTimeout(() => {
                        navigate("/login")
                    },2000 )
                }

                if(res.data.status === "failed"){
                    // Send SuccessFully Message
                    setError({ 
                        status:true, 
                        msg: res.data.message, 
                        type:"error" 
                    })
                }

            }else{
                // Send SuccessFully Message
                setError({ 
                    status:true, 
                    msg: "Password and Confirm Password Doesn't Match", 
                    type:"error" 
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
        <Grid container justifyContent="center">
            <Grid item sm={6} xs={12}>
                <h1>Reset Password</h1>
                {/******** Form **********/}
                <Box component="form" noValidate sx={{ mt:1 }} id="password-reset-form" onSubmit={handleSubmit}>

                    {/*****  Password Input Field  ******/}
                    <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />

                    {/*****  Confirm Password Input Field  ******/}
                    <TextField margin="normal" required fullWidth id="password_confirmation" name="password_confirmation" label="Confirm Password" type="password" />

                    {/*****  Button  ******/}
                    <Box textAlign="center">
                        <Button type="submit" variant="contained" sx={{ mt:3 , mb:2, px:5 }} >Submit</Button>
                    </Box>

                    {/*******  show Error If Email Field Empty *****/}
                    {error.status?<Alert severity={error.type}>{error.msg}</Alert>:""}

                </Box>
            </Grid>
        </Grid>
    </>
    )
}

export default PasswordReset