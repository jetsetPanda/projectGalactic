import React, {Component} from 'react';

import './Login.css'
import AuthContext from '../context/AuthContext';

class LoginPage extends Component {
    state = {
        isLoggedIn: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailElemFX = React.createRef();
        this.passwordElemFX = React.createRef();
    }

    handleClick = () => {
        this.setState(prevState => {
            return { isLoggedIn: !prevState.isLoggedIn}
        })
    };

    handleSubmit = event => {
        event.preventDefault();
        const email = this.emailElemFX.current.value;
        const password = this.passwordElemFX.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        console.log(email,password);

        let requestBody = {
            query: `
                query {
                    login(
                        email: "${email}",
                        password: "${password}"
                    ) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isLoggedIn) {
            requestBody = {
                query: `
                mutation{
                    createUser(userArg: {
                        email: "${email}",
                        password: "${password}"
                    }) {
                        _id
                        email
                    }
                }
            `,
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Req Failed.');
            }
            return res.json();
        }).then(resData => {
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
            console.log(resData);
        }).catch(err => {
            console.log(err)
        });

    };

    render() {
        return (
            <form className="login-form" onSubmit={this.handleSubmit}>
                <h1 style={{color: "#75d11a"}}>Sign In</h1>
                <div className="form-item">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailElemFX}/>
                </div>
                <div className="form-item">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordElemFX}/>
                </div>
                <div className="form-action">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.handleClick}>
                        Click to {this.state.isLoggedIn ? 'Signup': 'Login'}
                    </button>


                </div>

            </form>
        );
    }
}

export default LoginPage;