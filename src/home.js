import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'; 
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './home.css';

function HomePage() {
  let [username, updateUsername] = useState('');
  let [chatRoom, updatechatRooms] = useState([]);
  let [newChatRoom, updateNewChatRoom] = useState('');

  useEffect(() => {
    pageLoad();
  }, []);

    function pageLoad(){
        axios.get('/getUserName')
        .then((response) => {            
            let user = response.data;

            for(let key in user){
                let arrayOfNames = user[key];                            
                let getLastname = arrayOfNames.slice(-1)[0];
                updateUsername(getLastname);
            }
        }).catch((error) => {
            console.log(error);
        });

        axios.get('/chatroom')
        .then((response) => {
            updatechatRooms(response.data);            
        }).catch((error) => {
            console.log(error);
        });
    }

    function listRooms(room){
        return (
            <li key={room.id}>{room.name}<button onClick={removeClassRom}>X</button></li>
        )   
    }

    function onChange(e){        
        updateNewChatRoom(e.target.value);
    }

    function addClassRoom(){
        //fixa validering  tex inte kunna posta om strängen är tom
        axios.post('/chatroom/add', {name: newChatRoom})
    }

    function removeClassRom(e){
        let remove = e.target.value
        console.log(remove);
    }

    return (
        <div className='homeContainer'>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <header className='homeHeader'>
            <h1 className='welcomeText'>Chat<span className='welcomeText welcomeText-span'>Room</span></h1>
            <p className='welcomeText-username'>Welcome {username} </p>
            </header>

            <div className='nav-sidebar'>
                <input className='nav-sidebar-input' placeholder='room name' onChange={onChange}></input>
                <button nav-sidebar-button onClick={addClassRoom}>Add classRoom</button>
                <ul>
                    {chatRoom.map((room) => listRooms(room))}
                </ul>
            </div>
            <div className='messageContainer'>
                <p>lorem ipsum nääääe</p>
            </div>
        </div>
    )

}

export default HomePage;