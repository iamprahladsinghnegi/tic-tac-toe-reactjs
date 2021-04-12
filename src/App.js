import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Game } from './pages/game';
import { Start } from './pages/start';
import { Welcome } from './pages/welcome';


export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/start" component={Start} />
        <Route path="/game" component={Game} />
        <Redirect from={"*"} to={'/'} />
      </Switch>
    </BrowserRouter>
  );
};

