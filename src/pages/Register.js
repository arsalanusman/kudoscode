import React, { Component } from 'react';

import FormErrors from "./../components/FormErrors";
import Validate from "./../components/utility/FormValidation";
import Header from "./../theme/layouts/header";
import Logo from './../theme/components/Logo'
import Grid from '../theme/components/Grid'
import Card from '../theme/components/Card'
import Input from '../theme/components/Input'
import Button from '../theme/components/Button'

import { Auth } from "aws-amplify";

import GoogleLogin from 'react-google-login';
import AWS from 'aws-sdk';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import CSVReader from 'react-csv-reader'


const responseGoogle = (response) => {
  console.log(response);
}


const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header =>
    header
      .toLowerCase()
      .replace(/\W/g, '_')
}


var base64 = require('base-64');
let headers = new Headers();
headers.set('Authorization', 'Basic ' + base64.encode('arsalan.usman@kudoscode.com' + ":" + 'Arsalan0341'));



class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    company:"",
    company_type:"",
    compnayNames: '',
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  }

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

    const { username, email, password, name, zoneinfo } = this.state;

    try{

      const signUpResponse = await Auth.signUp({
        username,
        password,
        "cognito:groups": ["admin"],
        attributes: {
          email: email,
          zoneinfo:'',
          name:"kudoscode"
        }
      });
      
      //var params = {
      //  GroupName: 'Admin', /* required */
      //  UserPoolId: signUpResponse.user.pool.userPoolId,
      //  Username: signUpResponse.user.username
      //};
      //var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
      //
      //cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
      //  if (err) console.log(err, err.stack); // an error occurred
      //  else     console.log(data);           // successful response
      //});
      console.log(signUpResponse);
      this.props.history.push('/');
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
    // AWS Cognito integration here
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }
  onSelectChange = ( event,name ) => {
    const {options, selectedIndex} = event.target;
    this.setState({
      [name]:options[selectedIndex].innerHTML
    })
    console.log(this.state)
  }
  componentDidMount(){
    fetch("https://cors-anywhere.herokuapp.com/https://work.kudoscode.com/companies.json",  {
      method:'GET',
      headers: headers,
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          compnayNames:result.companies
        })
      })
  }
  
  render() {
    return (
        <>
        <header>
          <div className="container">
            <div className="row navi-column" style={{justifyContent: 'center'}}>
              <div className="column">
                <Logo />
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <Grid col="3"></Grid>
            <Grid col="4" textAlign="center">
              <h1><em>Get Started</em></h1>
              <p>Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metus, scelerisque nec pharetra id, tempor</p>
            </Grid>
            <Grid col="3"></Grid>
          </div>
          <div className="row">
            <Grid col="3"></Grid>
            <Grid col="4">
              <Card>
                <FormErrors formerrors={this.state.errors} />
                <form onSubmit={this.handleSubmit}>
                  <Input lable="First Name" icon="user-i" type="text" placeholder="Enter your first Name" />
                   <Input lable="Last Name" icon="user-i" type="text" placeholder="Enter your last Name" />
                  <Input lable="Agency (Company Name)" icon="user-i" type="text" placeholder="Enter your company name" />
                  <Input lable="Password" icon="pass-i" type="text" placeholder="Enter your password" />
                  <input type="hidden" name="company" value="company1" />
                  <Button type="primary" field="submit"  title="Register" icon="" color="" link="#"/>
                  <hr />
                </form>
                <Button type="secondary" field="" isFull="true" title="Login" icon="" color="light" link="/login" />
              </Card>
            </Grid>
            <Grid col="3"></Grid>
          </div>
        </div>
      <section className="section auth">
        <div className="container">
          <h1>Register</h1>
          <FormErrors formerrors={this.state.errors} />
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="text"
                  id="username"
                  aria-describedby="userNameHelp"
                  placeholder="Enter username."
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <select  id="company" onChange={(e)=>this.onSelectChange(e,'company')}>
                  {this.state.compnayNames && this.state.compnayNames.map((items,index)=>
                      <option value="5f8051147596ca3240a8e8c6" key={index}>{items.name}</option>
                  )}
                </select>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <select id="company_type" onChange={(e)=>this.onSelectChange(e,'company_type')}>
                    <option value="1">Agency</option>
                    <option value="2">Agency Client</option>
                    <option value="3">Driect Client</option>
                </select>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input 
                  className="input" 
                  type="email"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
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
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input 
                  className="input" 
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm password"
                  value={this.state.confirmpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Register
                </button>
                  <Link to='/' className="button is-success">
                    Back
                  </Link>
              </p>
            </div>
          </form>
        </div>
        {/* <GoogleLogin
          clientId="800949679970-gm7kn23ikf66ukb23ti3itoaire0h6li.apps.googleusercontent.com"
          clientSecret="x4JqCV0zlTkJSQ-hkFvJljJU"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <CSVReader onFileLoaded={(data, fileInfo) => console.dir(data, fileInfo)} /> */}
   
      </section>
        </>
    );
  }
}

export default Register;