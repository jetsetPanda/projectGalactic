import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import LoginPage from "./pages/Login";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavbar from "./components/Navigation/MainNavbar";

import './App.css';

function App() {
  return (
    <BrowserRouter>
        <React.Fragment>
            <MainNavbar/>
            <main className='main'>
                <Switch>
                    <Redirect from="/" to="/auth" exact/>
                    <Route path="/auth" component={LoginPage} />
                    <Route path="/events" component={EventsPage} />
                    <Route path="/bookings" component={BookingsPage} />
                </Switch>
            </main>
        </React.Fragment>

    </BrowserRouter>
  );
}

export default App;
