import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'; 
import axios from 'axios';
import {user$} from "./store";
import './home.css';

function HomePage() {
  let [chatRoom, updatechatRooms] = useState([]);
  let [newChatRoom, updateNewChatRoom] = useState('');

  useEffect(() => {
    pageLoad();
  }, [chatRoom]);

    function pageLoad(){
        axios.get('/chatroom')
        .then((response) => {
            updatechatRooms(response.data);            
        }).catch((error) => {
            console.log(error);
        });
    }

    function listRooms(room){
        return (
            <li key={room.id}>{room.name}<button onClick={removeClassRom} id={room.id}>X</button></li>
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
        let remove = e.target.id;
        
        axios.delete(`/chatroom/${remove}`)
        .then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className='homeContainer'>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <header className='homeHeader'>
                <div className='header-info'>
                    <p className='welcomeText-username'>User: {user$.value} </p>
                </div>
                <h1 className='welcomeText'>Chat<span className='welcomeText welcomeText-span'>Room</span></h1>
            </header>
            <div className='nav-sidebar'>
                <input className='nav-sidebar-input' placeholder='room name' onChange={onChange}></input>
                <button className='nav-sidebar-button' onClick={addClassRoom}>Add classRoom</button>
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