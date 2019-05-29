const express = require('express');
const app = express();
const fs = require('fs');
const history = require('./history.json');
const port = 8080;
const id = require('uuid/v1');
// const io = require('socket.io')(http);

app.use(express.json());

setInterval(() => { //sparar rum och meddelanden i history.json
    fs.writeFile("./history.json", JSON.stringify(history), function(err) {
      if (err) throw err;
      console.log("done with fs writeFile", history);
    });
  }, 5000);

app.get('/', function(req, res){
    // fixa felhantering
    res.status(200).send(history);
});

app.post('/chatroom', function(req, res) { //skapa rum
    let name = req.body.name;
    let chatroom ={
        id: id(),
        name: name,
        messages: [],
    };
    history.chatRooms.push(chatroom);
    //felhantering
    res.status(201).send(chatroom);
});

app.post('/chatroom/:id/message', function(req, res){ //skapa meddelanden
    let id = req.params.id;
    let content = req.body.content;
    let chatRooms = history.chatRooms;

    for (let index in chatRooms){ //lopa igenom alla chatrooms för att hitta rätt rum 
        if(id === chatRooms[index].id){
            let message= {
                id: id(),
                from:  '',
                content: content,
            };
            chatRooms[index].messages.push(message)
        }
    }
})


app.listen(port, function() {
    console.log('listening on', port);
});
