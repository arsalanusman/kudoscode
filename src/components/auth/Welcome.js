import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import Amplify, { API } from 'aws-amplify';

import awsmobile from './../../aws-exports';

Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure(awsmobile);

class Welcome extends Component {

  componentDidMount(){
  }
  
  handleLogout = async event => {
    event.preventDefault();
    try{
      Auth.signOut();
      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
      this.props.history.push('/')
    }catch(error){
      console.log(error.message);
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let data = {
      client_name : formData.get('client_name'),
      website_url : formData.get('website_url'),
      admin_url : formData.get('admin_url'),
      username : formData.get('username'),
      password : formData.get('password'),
      package : formData.get('package'),
    }
    let apiName = 'devKudos';
    let path = '/website';
    let myInit = { // OPTIONAL
        body: data, // replace this with attributes you need
    }
    return API.post(apiName, path, myInit)
    .then(result => this.props.history.push('/letsgo'))
    .catch(err => console.log(err));
  }
  sendAPI = () => {
    API.get('devKudos','/website');
    console.log('working')
  }
  render(){

 
    return (
      <section className="section auth">
        {this.props.auth.isAuthenticated && this.props.auth.user && (
                <div className="container">
                  <h1>Welcome! {this.props.auth.user.username}</h1>
                  <p>Company: {this.props.auth.user.attributes["custom:company_name"]}</p>
                  <a onClick={this.handleLogout}  className="button is-light">Logout</a>
               

                  <form onSubmit={this.handleSubmit}>
                      <div className="field">
                        <p className="control">
                          <input 
                            className="input" 
                            type="text"
                            name="client_name"
                            value={this.props.auth.user.username}
                            readOnly
                          />
                        </p>
                        <p className="control">
                          <input 
                            className="input" 
                            type="text"
                            name="website_url"
                            placeholder="Website Url"
                          />
                        </p>
                        <p className="control">
                          <input 
                            className="input" 
                            type="text"
                            name="admin_url"
                            placeholder="Admin Url"
                          />
                        </p>
                        <p className="control">
                          <input 
                            className="input" 
                            type="text"
                            name="username"
                            placeholder="Username"
                          />
                        </p>
                        <p className="control">
                          <input 
                            className="input" 
                            type="text"
                            name="password"
                            placeholder="Password"
                          />
                        </p>
                        <p className="control">
                          <label>
                            Standard
                            <input 
                              className="radio" 
                              type="radio"
                              name="package"
                              value="50"
                            />
                          </label>
                          <label>
                            Patilum
                            <input 
                              className="radio" 
                              type="radio"
                              name="package"
                              value="100"
                            />
                          </label>
                        </p>
                        <input className="hidden" type="hidden" name="uesr_id" value=""/>
                      </div>  
                      <button className="button is-success">
                          Add website
                        </button>
                    </form> 
                  </div>
            
              )}
              <button onClick={()=>this.sendAPI()}>Test</button>
         </section>
    )
  }
}

export default Welcome;
