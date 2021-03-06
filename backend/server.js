const express = require('express');
const app = express();
const fs = require('fs'); 
const history = require('./history.json');
const port = 8080;
const uuid = require('uuid/v1');
const saveUsername = require('./username.json');
const socket = require('socket.io');

const server = app.listen(port, function() {
    console.log('listening on', port);
});
const io = socket(server);


app.use(express.json());

setInterval(() => {     //sparar rum och meddelanden i history.json
    fs.writeFile("./history.json", JSON.stringify(history), function(err) {
      if (err) throw err;
      console.log("done with fs writeFile", history);
    });
  }, 30000);

/* === GET === */

app.get('/', function(req, res){
    if(req.status !== 200){
        res.status(400).send(req.status);
        return;
    }
    res.status(200).send(history);
    res.sendFile(__dirname + './msg.js');
});

app.get('/chatroom', function(req, res){
    //validering
        res.status(200).send(history.chatRooms);
    });

app.get('/chatroom/:id/message', function(req, res){
    let id = req.params.id;
    let rooms = history.chatRooms;

    for(let room of rooms){
        if(id === room.id){
            console.log(room.messages);
            res.status(200).send(room.messages); 
            return;
        }
    }
    res.status(400).send('nono')
})
 
/* === POST === */ 

app.post('/username', function(req, res){ //skapa användarnamn och spara i username.json
    let newUsername = req.body.username;    
    let usernames = saveUsername.username;    

    for (let name of usernames) {             
        if(name === newUsername){
            res.status(400).send('this name is already taken')
            return;
        } 
    }
    usernames.push(newUsername);
    fs.writeFile('./username.json', JSON.stringify(saveUsername), function(err) { 
        if (err) throw err;
        console.log('done with fs writeFile', saveUsername);
      });   

      res.status(200).send(newUsername);
});

app.post('/chatroom/:id/message', function(req, res){ //skapa meddelanden
    let id = req.params.id;    
    let value = req.body.value;
    let user = req.body.user; 
    let chatRooms = history.chatRooms;
    console.log('ID', value);

    for (let index in chatRooms){ //lopa igenom alla chatrooms för att hitta rätt rum 
        if(id === chatRooms[index].id){
            let message= {
                id: uuid(),
                from:  user,
                value: value,
            };
            chatRooms[index].messages.push(message);
            res.status(201).send(message);
            io.emit("new_message", { id, message });
            return;
        }
    }
    res.status(400).send('nope');
});

app.post('/chatroom/add', function(req, res) { //skapa rum
    let name = req.body.name;
    let chatroom ={
        id: uuid(),
        name: name,
        messages: [],
    };
    history.chatRooms.push(chatroom);

    res.status(201).send(chatroom);
});

/* === DELETE === */

app.delete('/chatroom/:id', function (req, res) {
    let removeRoom = req.params.id;
    let chatRooms = history.chatRooms;

    for( index in chatRooms){
        if(chatRooms[index].id === removeRoom){
            chatRooms.splice(index, 1)
            res.status(200).send(chatRooms);
            return;
        }   
    } 
    res.status(404).send('Not found');
    return;
})

