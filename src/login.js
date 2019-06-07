import React, {useState} from 'react';
import { Helmet } from 'react-helmet'; 
import { Redirect } from 'react-router-dom' 
import axios from 'axios';
import {user$, updateUser} from "./store";
import './login.css';

function Login() {
    let [username, updateUsername] = useState('');
    let [checkUser, updateCheckuser] = useState(false);
    let [errMsg, updateErrMsg] = useState(false);
    
    function onChange(e){  
       updateUsername(e.target.value)
    }

    function postUsername(e) { 
        console.log({user$});
        
        e.preventDefault();
        console.log(username);
        
        axios.post('/username', {username: username})
        .then((response) => {
            console.log(response.data);
            
            updateCheckuser(true)
            updateUser(response.data); //spara namnet i store.js
        }) 
        .catch((error) => {
            console.error('hejhej') // Fixa felet
            updateErrMsg('Name already taken');
        })
    }

    if(checkUser){
        return <Redirect to='/Home'/>
    }

    return (
    <div className='loginForm-container'>
        <Helmet>
            <title>Login</title>
        </Helmet>
        <h1 className='welcomeText'>Welcome to Chat<span className='welcomeText-span'>Room</span></h1>
        <form className='loginForm' onSubmit={postUsername}>
            <label className='loginForm-label'>
                {errMsg ? (<p className='login-errMsg'>{errMsg}</p>) : <p>Choose username:</p>}
                <input className='loginForm-input' onChange={onChange}/>
            </label>
            <button className='loginForm-button' type='submit'>Continue</button>
        </form>
    </div>
    )
}

export default Login;