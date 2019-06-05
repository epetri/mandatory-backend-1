const express = require('express');
const app = express();
const fs = require('fs'); 
const history = require('./history.json');
const port = 8080;
const id = require('uuid/v1');
const saveUsername = require('./username.json');
// const io = require('socket.io')(http);

app.use(express.json());

let user; 

setInterval(() => { //sparar rum och meddelanden i history.json
    fs.writeFile("./history.json", JSON.stringify(history), function(err) {
      if (err) throw err;
      console.log("done with fs writeFile", history);
    });
  }, 30000);

app.get('/', function(req, res){
    if(req.status !== 200){
        resr.status(400).send(req.status);
        return;
    }
    res.status(200).send(history);
});

app.post('/username', function(req, res){ //skapa användarnamn och spara i username.json
    let username = req.body.username;    
    let usernames = saveUsername.username;

    for (let name of usernames) { //funkar inte, man kan fortfarande lägga tll ett namn fast det redan finns
        if(name !== username){
            console.log(name);
            
            usernames.push(username); //utför ändringen
            res.status(201).send(username);
            fs.writeFile("./username.json", JSON.stringify(saveUsername), function(err) { //spara ändringen (username)
                if (err) throw err;
                console.log("done with fs writeFile", saveUsername);
              });   
              return;
        }
    }
    res.status(400).send("this name is already taken")
});

app.get('/getUserName', function(req, res){
    res.status(200).send(saveUsername);
})

app.post('/chatroom/add', function(req, res) { //skapa rum
    let name = req.body.name;
    let chatroom ={
        id: id(),
        name: name,
        messages: [],
    };
    history.chatRooms.push(chatroom);
    if(res.status !== 201){
        res.status(400).send(res.status);
        return;
    }
    res.status(201).send(chatroom);
});

app.get('/chatroom', function(req, res){

    res.status(200).send(history.chatRooms);
})


app.post('/chatroom/:id/message', function(req, res){ //skapa meddelanden
    let id = req.params.id;
    let content = req.body.content;
    let chatRooms = history.chatRooms;

    for (let index in chatRooms){ //lopa igenom alla chatrooms för att hitta rätt rum 
        if(id === chatRooms[index].id){
            let message= {
                id: id(),
                from:  user,
                content: content,
            };
            chatRooms[index].messages.push(message);
            res.status(201).send(message);
            return;
        }
    }
    res.status(400).send('nope');
});

app.post("/login", (req,res)=>{
    let username = req.body.username;
    user = username;
    app.status(201).send(username);
});


/* 
    en post till användaren
    en delete. loopa chattrum
    hämta ett spec. chattrum

*/


app.listen(port, function() {
    console.log('listening on', port);
});
