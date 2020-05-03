import React, {Component} from 'react';

import './Login.css'

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.emailElemFX = React.createRef();
        this.passwordElemFX = React.createRef();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const email = this.emailElemFX.current.value;
        const password = this.passwordElemFX.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        console.log(email,password);

        const requestBody = {
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

        fetch('http://localhost:8000/graphql', {
            method: 'POST', //cuz graphQL ;)
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })

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
                    <button type="button">Sign Up</button>


                </div>

            </form>
        );
    }
}

export default LoginPage;