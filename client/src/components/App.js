import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from "./views/LoginPage/LoginPage";


function App() {
  return (
    <div>
      <Switch>
        <Route path="/login" component={LoginPage} />
      </Switch>
    </div >
  );
}

export default App;
