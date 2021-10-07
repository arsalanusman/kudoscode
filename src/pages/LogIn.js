import React, { Component } from 'react';

import FormErrors from "./../components/FormErrors";
import Validate from "./../components/utility/FormValidation";
import Header from "./../theme/layouts/header";
import Logo from './../theme/components/Logo'
import Grid from '../theme/components/Grid'
import Card from '../theme/components/Card'
import Input from '../theme/components/Input'
import Button from '../theme/components/Button'

import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";


import Amplify, { Auth} from "aws-amplify";
import jwt_decode from 'jwt-decode';
import API from '@aws-amplify/api';

import awsmobile from './../aws-exports';
Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure(awsmobile);




//var base64 = require('base-64');
//let headers = new Headers();
//headers.set('Authorization', 'Basic ' + base64.encode('arsalan.usman@kudoscode.com' + ":" + 'Arsalan0341'));

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
  //constructor(props){
  //  super(props)
  //  this.state = {
  //    projects:[],
  //    details:''
  //  }
  //}
  componentDidMount(){


    //fetch("https://cors-anywhere.herokuapp.com/https://work.kudoscode.com/projects.json",  {method:'GET',
    //    headers: headers,
    //    //credentials: 'user:passwd'
    //  })
    //  .then(res => res.json())
    //  .then(
    //    (result) => {
    //      this.setState({
    //        projects:result.projects
    //      })
    //  })


    //let apiNames = 'KudosAPI';
    //let paths = '/login';
    //let optionss = {}
    //API.get(apiNames, paths, optionss).then(response => {
    //  console.log(response)
    //});

    //let apiName = 'KudosAPI';
    //let path = '/general';
    //let options = {}
    //API.get(apiName, path, options).then(response => {
    //  console.log(response)
    //});
    console.log(this.props,'testingOLD')

  }
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

    //console.log(this.state ,'onInputChange')
    //let apiName = 'kudosAPI';
    //let path = '/login';
    //let options = {
    //    body : {
    //      username:username, email:email, password:password, company:company
    //    }
    //}
    //API.post(apiName, path, options).then(response => {
    //  console.log(response)
    //});
    try{
      const user = await Auth.signIn(this.state.username, this.state.password, this.state.company);
     
      //console.log(user.pool.userPoolId);
      let token = user.signInUserSession.idToken.jwtToken;
      let userCompany = user.signInUserSession.idToken.payload['cognito:groups'];
      let decoded = jwt_decode(token);
      console.log(user,'userDetails');
      console.log(userCompany,'ser.signInUserSession');
      //console.log(decoded['cognito:groups']);
      console.log(decoded);

      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser(user);
      this.props.isLogin(userCompany[0])
      localStorage.setItem('company_name',userCompany[0])
      
      if(this.props.match.url == '/login'){
        this.props.history.push('/dashboard/');
      }else{
        this.props.history.push(this.props.match.url);
      }
      

     
      

      //window.history.back()

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
  //
  //getDetails = (id) => {
  //
  //  fetch("https://cors-anywhere.herokuapp.com/https://work.kudoscode.com/projects/"+id+"/tasks.json",  {method:'GET',
  //    headers: headers,
  //  })
  //      .then(res => res.json())
  //      .then(
  //          (result) => {
  //            this.setState({
  //              details:result['todo-items']
  //            })
  //          })
  //
  //}
  //updateDetails = (id) => {
  //  const someData = {
  //    "todo-item": {
  //      "content": "This is our new task"
  //    }
  //  }
  //  fetch("https://cors-anywhere.herokuapp.com/https://work.kudoscode.com/tasks/20418851.json",  {method:'PUT',
  //    headers: headers,
  //    body: JSON.stringify(someData)
  //    //credentials: 'user:passwd'
  //  })
  //      .then(res => res.json())
  //      .then(
  //          (result) => {
  //            this.setState({
  //              details:result['todo-items']
  //            })
  //          })
  //
  //}
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
        <div className="projects">
          {/* {this.state.projects && this.state.projects.map((items,index)=>
            <h1 key={index} onClick={()=>this.getDetails(items.id)}>{items.name}</h1>
          )}
          {this.state.details && this.state.details.map((item,index)=>
            <h1 onClick={()=>this.updateDetails(item['todo-list-id'])}>{item['todo-list-name']}</h1>
          )}
          {console.log(this.state.details)}
          */}
        </div>
        <div className="row">
          <Grid col="3"></Grid>
          <Grid col="4">
            <Card>
              <FormErrors formerrors={this.state.errors} />
              <form onSubmit={this.handleSubmit}>
                <Input lable="Username" icon="user-i" id="username" type="text" placeholder="Enter your Username" func={this.onInputChange} />
                <Input lable="Password" icon="pass-i" id="password" type="password" placeholder="Enter your password" func={this.onInputChange} />
                {/* <Input lable="First Name" icon="user-i" type="text" placeholder="Enter your first Name" />
                  <Input lable="Last Name" icon="user-i" type="text" placeholder="Enter your last Name" />
                 <Input lable="Agency (Company Name)" icon="user-i" type="text" placeholder="Enter your company name" />
                 <Input lable="Password" icon="user-i" type="text" placeholder="Enter your password" /> */}
                <input type="hidden" name="company" value="company1" />
                <Button type="primary" field="submit"  title="Login" icon="" color="" link="#"/>
                <hr />
              </form>
                <Button type="secondary" field="" isFull="true" title="Register" icon="" color="light" link="/register" />
            </Card>
          </Grid>
          <Grid col="3"></Grid>
        </div>
      </div>
    </>
    );
  }
}

export default LogIn;