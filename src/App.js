import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Login from './login.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <Link>Change user</Link>
          </nav>
        </header>
        <Route exact path='/' component={Login}/>
      </div>
    </Router>
  );
}

export default App;



    