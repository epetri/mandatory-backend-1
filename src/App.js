import React from 'react';
import './App.css';
import axios from 'axios';

function doRequest(){
  axios.get('/login')
    .then(response=>{
      console.log(response);
    })
}



function App() {
  return (
    <div className="App">
      <h1>app.js</h1>
       <button onClick={doRequest}>jnljn</button> 
    </div>
  );
}

export default App;



    