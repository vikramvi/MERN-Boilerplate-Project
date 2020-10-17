import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage'

function App() {
  return (
    <div>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    </div >
  );
}

export default App;
