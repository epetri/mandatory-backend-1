import React from 'react';
import { Helmet } from 'react-helmet'; 
// import { Redirect } from 'react-router-dom' //installera
import axios from 'axios';
import './login.css';



function Login() {
    return (
    <div className='loginForm-container'>
        <Helmet>
            <title>Login</title>
        </Helmet>
        <h1 className='welcomeText'>Welcome to  Chat<span className='welcomeText-span'>Room</span></h1>
        <form className='loginForm'>
            <label className='loginForm-label'>
                Choose username:
                <input className='loginForm-input'/>
            </label>
            <button className='loginForm-button'>Continue</button>
        </form>
    </div>
    )
}

export default Login;