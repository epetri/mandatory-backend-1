import React, {useState} from 'react';
import { Helmet } from 'react-helmet'; 
import { Redirect } from 'react-router-dom' 
import axios from 'axios';
import './login.css';

function Login() {
    let [username, updateUsername] = useState('');
    let [checkUser, updateCheckuser] = useState(false);
    
    function onChange(e){  
       updateUsername(e.target.value)
    }

    function postUsername(e) {
        e.preventDefault();
        console.log(username);
        
        axios.post('/username', {username: username})
        .then((response) => {
            updateCheckuser(true)
            console.log(response);
        })
        .catch((error) => {
            console.error(error)
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
                Choose username:    
                <input className='loginForm-input' onChange={onChange}/>
            </label>
            <button className='loginForm-button' type='submit'>Continue</button>
        </form>
    </div>
    )
}

export default Login;