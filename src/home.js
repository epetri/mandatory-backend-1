import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { user$ } from "./store";
import './home.css';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');

socket.on('connect', function () {
    console.log('Connected');
});

function HomePage() {
    let [chatRoom, updatechatRooms] = useState([]);
    let [newChatRoom, updateNewChatRoom] = useState('');
    let [messages, updateMessages] = useState([]);
    let [newMsg, updateMsg] = useState('');
    let [currentRoom, updateCurrentRoom] = useState(null);

    let chatRoomId = '';
    useEffect(() => {
        pageLoad();
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket.on("new_message", data => {
                if (currentRoom === data.id) {
                    let copy = [...messages]
                    copy.push(data.message)
                    updateMessages(copy);
                }
            })
        }
        return () => {
            socket.off("new_message");
        }
    }, [messages])


    function pageLoad() {
        axios.get('/chatroom')
            .then((response) => {

                if (response.data.length === chatRoom.length) {
                    return;
                }
                updatechatRooms(response.data);

            }).catch((error) => {
                console.log(error);
            });
    }

    function listRooms(room) {
        return (
            <li className='room' key={room.id}><button className='deleteButton' onClick={removeClassRom} id={room.id}>&times;</button><p onClick={listMessages} id={room.id}>{room.name}</p></li>
        )
    }

    function onChange(e) {
        updateNewChatRoom(e.target.value);
    }

    function addClassRoom() {
        //fixa validering  tex inte kunna posta om strängen är tom        
        axios.post('/chatroom/add', { name: newChatRoom });
        pageLoad();
    }

    function listMessages(e) {
        chatRoomId = e.target.id;
        updateCurrentRoom(chatRoomId);
        axios.get(`/chatroom/${chatRoomId}/message`)
            .then((response) => {
                updateMessages(response.data);
                // console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
    }

    function removeClassRom(e) {
        let remove = e.target.id;
        axios.delete(`/chatroom/${remove}`)
            .then((response) => {
                // console.log(response);
            }).catch((error) => {
                console.log(error);
            })
    }

    function updateMessage(e) {
        updateMsg(e.target.value);
    }

    function sendMsg(e) {
        e.preventDefault();
        axios.post(`chatroom/${currentRoom}/message`, { value: newMsg, user: user$.value }).then(response => {
            console.log(response);
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
            <div className='border' />
            <div className='messageContainer'>
                <div className='messageContainer-messages'>
                    <ul className='messageContainer-ul'>
                        {messages.length === 0 ? null : messages.map(msg => {
                            return (
                                <li className='message' key={msg.id}>
                                    <p className='message-from'>{msg.from}</p>
                                    <p className='message-value'>{msg.value}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='messageContainer-form'>
                    <input onChange={updateMessage}></input>
                    <form onSubmit={sendMsg}>
                        <button type='submit'>Send</button>
                    </form>
                </div>

            </div>
        </div>
    )
}


export default HomePage;