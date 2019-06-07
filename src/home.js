import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'; 
import axios from 'axios';
import {user$} from "./store";
import './home.css';
import io from 'socket.io-client';
const socket = io('http://localhost:8181');


function HomePage() {
  let [chatRoom, updatechatRooms] = useState([]);
  let [newChatRoom, updateNewChatRoom] = useState('');
  let [messages, updateMessages] = useState([]);

  useEffect(() => {
    pageLoad();
  }, [chatRoom]);   //Gör om gör rätt hells yeah

    function pageLoad(){            //laddar hela tiden.. memoryleak?
        axios.get('/chatroom')
        .then((response) => {         

            console.log(chatRoom);
            console.log(response.data)
            
            if(response.data.length === chatRoom.length){
                return;
            } 
            updatechatRooms(response.data); 
           
            // updateMessages();           
        }).catch((error) => {
            console.log(error);
        });
    }

    function listRooms(room){
        return (
            <li onClick={listMessages} id={room.id} key={room.id}>{room.name}<button className='deleteButton' onClick={removeClassRom} id={room.id}>&times;</button></li>
        )       
    }

    function onChange(e){        
        updateNewChatRoom(e.target.value);
    }

    function addClassRoom(){
        //fixa validering  tex inte kunna posta om strängen är tom
        pageLoad();
        axios.post('/chatroom/add', {name: newChatRoom})
    }

    function listMessages(e){
        let idMsg = e.target.id;

        

        socket.emit('change-room', ({
            roomId: idMsg
          }));

            console.log(idMsg);
        axios.get(`/chatroom/${idMsg}/message`)
        .then((response) => {
            updateMessages(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);  
        })
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
            <div className='border'/>
            <div className='messageContainer'>
                <ul>
                    {messages.length === 0 ? null : messages.map(msg => {
                        console.log(msg.id);

                        return(
                            <li key={msg.id}> 
                                <p>{msg.from}</p>
                                <p>{msg.messages}</p> 
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default HomePage;