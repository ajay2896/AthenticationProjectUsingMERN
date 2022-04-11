



import { useState} from 'react'
import { Grid, TextField, Button, Box, Alert } from "@mui/material";
import { useSendPasswordResetEmailMutation } from '../../services/userAuthApi';

const SendPasswordResetName = () => {

    // RTK Query Hooks For reset Password
    const [ sendPasswordResetEmail , { isLoading }] = useSendPasswordResetEmailMutation();

    // Seeting Error Dynamically
    const [ error, setError ] = useState({
        status: false,
        msg: "",
        type: ""
    })

// When User click "LogIn" Button
const handleSubmit = async (e) => {
    e.preventDefault();
    // Get All Data From Form
    const data = new FormData(e.currentTarget);
    // Get Fields Data When user Enter
    const actualData = {
        email: data.get('email')
    }
    
    // If Data Present in Input Field
    if(actualData.email){

        // Passes Data To Backend of Frontend Data
        const res = await sendPasswordResetEmail(actualData);
        console.log(res);

        if(res.data.status === "success") {
            // If User submit after reset Fields Form
            document.getElementById('password-reset-email-form').reset();

            // Send Error Or Message
            setError({ 
                status:true, 
                msg: "Password Reset Email Sent, Please Check Your Email !!", 
                type:"success" 
            })
        }

        if(res.data.status === "failed"){
            setError({
                status: true,
                msg: res.data.message,
                type: "error"
            })
        }
        
    }else{
        setError({ 
            status:true, 
            msg: "Please Provide Valid Email", 
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
            <Box component="form" noValidate sx={{ mt:1 }} id="password-reset-email-form" onSubmit={handleSubmit}>

                {/*****  Email Input Field  ******/}
                <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />

                {/*****  Button  ******/}
                <Box textAlign="center">
                    <Button type="submit" variant="contained" sx={{ mt:3 , mb:2, px:5 }} >Send</Button>
                </Box>

                {/*******  show Error If Email Field Empty *****/}
                {error.status?<Alert severity={error.type}>{error.msg}</Alert>:""}

            </Box>
        </Grid>
    </Grid>
</>
)
}

export default SendPasswordResetName