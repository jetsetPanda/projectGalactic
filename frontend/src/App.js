import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import LoginPage from "./pages/Login";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavbar from "./components/Navigation/MainNavbar";
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
    state = {
        token: null,
        userId: null
    };

    login = (token, userId, tokenExpiration) => {
        this.setState({ token: token, userId: userId});
    };

    logout = () => {
        this.setState({ token: null, userId: null });
    };

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <AuthContext.Provider
                        value={{
                            token: this.state.token,
                            userId: this.state.userId,
                            login: this.login,
                            logout: this.logout
                        }}>
                        <MainNavbar/>
                        <main className='main'>
                            <Switch>
                                {!this.state.token && <Redirect from="/" to="/auth" exact/> }
                                {this.state.token && <Redirect from="/" to="/events" exact/> }
                                {this.state.token && <Redirect from="/auth" to="/events" exact/> }
                                {!this.state.token && (
                                    <Route path="/auth" component={LoginPage} />
                                )}
                                <Route path="/events" component={EventsPage} />
                                {this.state.token && (
                                    <Route path="/bookings" component={BookingsPage} />
                                )}
                            </Switch>
                        </main>
                    </AuthContext.Provider>

                </React.Fragment>

            </BrowserRouter>
        );
    }

}

export default App;
