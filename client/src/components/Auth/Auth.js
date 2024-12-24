import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import Icon from './icon';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom/';
import {signIn,signUp} from '../../actions/auth'

const initialState={firstName:'',lastName:'',email:'',password:'',confirmPassword:''}

const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const[formData,setFormData]=useState(initialState);
    const dispatch=useDispatch();
    const history=useHistory();

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }

   const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    if (isSignup) {
       const  response = await dispatch(signUp(formData, history));
        if (response && response.error) {
            alert(response.error); // Alert if there's an error
        }
    } else {
       const  response = await dispatch(signIn(formData, history));
        if (response && response.error) {
            alert(response.error); // Alert if there's an error
        }
    }

    // Check for errors in the response
   
};


    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})//this only changes which even name lke whether email or password or any input field  to change to value
    }

    const switchMode = () => {
        setIsSignup((prevSignUp) => !prevSignUp);
        handleShowPassword();
    }

    const googleSuccess = async (res) => {
        // console.log('Google login response:', res);
    
        try {
            // Get ID token from response
            const idToken = res.credential;
    
            if (idToken) {
                // Decode the JWT to extract user information
                const decodedToken = jwt_decode(idToken);
    
                // Prepare the result and token for dispatch
                const result = {
                    name: decodedToken.name,
                    email: decodedToken.email,
                    picture: decodedToken.picture,
                    sub:decodedToken.sub
                };
                const token = idToken;
    
                // Dispatch the AUTH action with the result and token
                dispatch({ type: 'AUTH', data: { result, token } });
                history.push('/')
            } else {
                throw new Error('ID token not found');
            }
        } catch (error) {
            console.error('Error decoding token or dispatching AUTH action:', error);
        }
    };
    

    const googleFailure = (error) => {
        console.log(error);
        console.log('Google sign in unsuccessful. Try again later.');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy='single_host_origin'
                        render={(renderProps) => (
                            <Button
                                className={classes.googleButton}
                                color="primary"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />} // Example icon component
                                variant="contained"
                            >
                                Google Sign In
                            </Button>
                        )}
                    />

                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Auth;