import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Login from './login.js';
import Home from './home.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <Link to='/' >Change user</Link>
          </nav>
        </header>
        <Route exact path='/' component={Login}/>
        <Route path='/Home' component={Home}/>
      </div>
    </Router>
  );
}

export default App;



    