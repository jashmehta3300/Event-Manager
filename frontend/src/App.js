import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import RegisterPage from './pages/Register';
import MainNavigation from './components/Navigation/MainNavigation';
import CreateEvent from './pages/CreateEvent';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!localStorage.getItem('token') && (
                <Redirect from="/" to="/auth" exact />
              )}
              {localStorage.getItem('token') && (
                <Redirect from="/" to="/events" exact />
              )}
              {localStorage.getItem('token') && (
                <Redirect from="/auth" to="/events" exact />
              )}
              {!localStorage.getItem('token') && (
                <Route path="/auth" component={AuthPage} />
              )}
              <Route path="/create/event" component={CreateEvent} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/events" component={EventsPage} />
              <Route path="/bookings" component={BookingsPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
