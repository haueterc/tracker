import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import SearchInput from './components/SearchInput/SearchInput';
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter className="App">
        <Switch>
          <Route exact path='/' Component={SearchInput}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
