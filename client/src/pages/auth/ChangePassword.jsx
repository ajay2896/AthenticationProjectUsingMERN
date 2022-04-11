



import { Box, TextField, Button, Alert } from '@mui/material'
import { useState } from 'react'
import { getToken } from '../../services/LocalStorageService';
import { useChangeUserPasswordMutation } from '../../services/userAuthApi';

const ChangePassword = () => {

    // Call Function From Using RTK Query HOOKS
    const [ changeUserPassword , { isLoading } ] = useChangeUserPasswordMutation();

    // Get Token From Local storage
    const token = getToken();

    // IF Any Error Than Set Message
    const [ error, setError ] = useState({
        status: false,
        msg:"",
        type:""
    });

    // When User Submit 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get Data OF Form
        const data = new FormData(event.currentTarget);

        // Get Data From Form
        const actualData = {
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation')
        }

        if(actualData.password && actualData.password_confirmation){
            if(actualData.password === actualData.password_confirmation){
                
                // Call API RTK Query Fuction
                const res = await changeUserPassword({ actualData, token });

                // Send Message For Frontend Error
                if(res.data.status === "success"){
                    document.getElementById("password-change-form").reset();
                    setError({ 
                        status: true, 
                        msg: "Password Changed Successfully", 
                        type: "success" 
                    });
                }

                // For Message For Bakend Error
                if(res.data.status === "failed"){
                    document.getElementById("password-change-form").reset();
                    setError({ 
                        status: true, 
                        msg: res.data.message, 
                        type: "error" 
                    });
                }
            }else{
                setError({
                    status: true,
                    msg: "Password and Confirm Password Doesn't Match",
                    type: "error"
                })
            }
        }else{
            setError({
                status: true,
                msg: "All Fields are Required",
                type: "error"
            })
        }
    }

  return (
    <>
        <Box sx={{ display:'flex', flexdirection:'column', flexWrap:'wrap', maxWidth: 600, mx:4 }}>

            <h1>Change Password</h1>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt:1 }} id="password-change-form">

                <TextField margin="normal" required fullWidth name="password" label="New Password" />

                <TextField margin="normal" required fullWidth name='password_confirmation' label="Confirm New Password" type="password" id="password_confirmation" />
                
                <Box textAlign='center'>
                    <Button type="submit" variant="contained" sx={{ mt:3, mb:2, px:5 }}>Update</Button>
                </Box>

                {/********  When any Error in After Submit Form  ********/}
                { error.status ? <Alert severity={ error.type }> { error.msg}</Alert> : ""  }
            </Box>
        </Box>
    </>
  )
}

export default ChangePassword