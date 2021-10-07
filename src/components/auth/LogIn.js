import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import { Auth } from "aws-amplify";
import jwt_decode from 'jwt-decode';


class LogIn extends Component {
  state = {
    username: "",
    password: "",
    company:"",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here

    const { username, email, password, company } = this.state;
    try{
      const user = await Auth.signIn(this.state.username, this.state.password, this.state.company);
      console.log(user);
      //console.log(user.pool.userPoolId);
      let token = user.signInUserSession.idToken.jwtToken;
      let decoded = jwt_decode(token);

      //console.log(decoded['cognito:groups']);
      //console.log(decoded);
      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser(user);
      this.props.history.push('/Welcome');
    }catch(error){
      let err = null;
      !error.message ? err = {"message": error} : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };
register = event => {
	this.props.history.push('/register')
}
  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Log in Test</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter username or email"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input 
                  className="input" 
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
              <input type="hidden" name="company" value="company1" />
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Login
                </button>
              </p>
            </div>
            <div className="field">
              <p className="control">
                  <Link to='/register' className="button is-success">
                    Register
                  </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LogIn;