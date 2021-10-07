import React, { Component, useState} from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import Products from './components/Products';
// import ProductAdmin from './components/ProductAdmin';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import LetsGo from './components/auth/LetsGo';

// import Footer from './components/Footer';
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import API from '@aws-amplify/api';
import { encode } from "base-64";

//Start New code

import Header from './theme/layouts/header';
import Footer from './theme/layouts/footer';
import Home from './pages/home';
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Supports from './pages/Support'
import AddSupports from './pages/addSupport'
import SupportDetails from './pages/supportDetails'
import Details from './pages/Details'
import TokenUpdate from './pages/tokenUpdate';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import useSWR, { mutate, trigger } from "swr";
//End new code

library.add(faEdit);

//testing
const cors = 'https://cors-anywhere.herokuapp.com/';
const admin = {
  baseUrl: 'https://work.kudoscode.com',
  username: 'twp_zh3uwC8M83JU55kQ8smEeKSRjTFg',
  password:'.'
}


class App extends Component {
  constructor(props){
    super(props)
  }
  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    company: null,
    refresh_token: null,
    access_token: null,
    project:null,
    isLoading:false,
    user: null,
    redirect:false
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }



//update json on amplify update yml as
  getLoginDetails = (e) => {
    localStorage.setItem('companyId',e)
    localStorage.setItem('company_name',e)
    let apiName = 'kudosAPI';
    let path = '/general';
    let options = {
      body: {
        id: localStorage.getItem('company_name') == "kodoscode" ? '5f8050f17596ca3240a8e8c4' :localStorage.getItem('company_name')
      }
    }
    API.post(apiName, path, options).then(response => {
          localStorage.setItem('company', JSON.stringify(response.body) )
          if(response.body._id){
          var path = '/general/sub_company';
          var options = {
            body: {
              parent_company_id: response.body._id
            }
          }
          API.post(apiName, path, options).then(sub => {
            localStorage.setItem('sub_companies', JSON.stringify(sub.body) )
          })
        }


        fetch(admin.baseUrl + "/companies/" + response.body.tw_companyID + ".json", {
          method: 'Get',
          headers: new Headers({
            'Authorization': 'Basic ' + encode(admin.username + ':' + admin.password),
            'Content-Type': 'application/json'
          }),
        })
        .then(response => response.json())
        .then(data => localStorage.setItem('tw_company', JSON.stringify(data.company)))
          
        //this.props.history.push('/dashbaord/')
    });
    console.log(localStorage.getItem('company_name'))

  }


  async componentDidMount(){
    try{
      const session = await Auth.currentSession();
      this.setAuthStatus(true);
      //console.log(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    }catch(error){
      //console.log(error);
    }
    this.setState({ isAuthenticating: false});

    //API.get("kudosAPI","/general/refreshToken", '').then(response => localStorage.setItem('access_token', response.body[response.body.length -1]['access_token'].toString()) )


    // var params = {
    //   grant_type:"authorization_code",
    //   client_id:"6A6239ABF4834F2AA252940D49067EA8",
    //   code:"71d923f69def78870d3ca388d9b6228da4fb8137fe034efef2f4207007059b63",
    //   redirect_uri:"https://master.d2h6sdayg5gcd8.amplifyapp.com/",
    //   code_verifier:"thisismycode123thisismycode123thisismycode123thisismycode123"
    //
    //   // grant_type: "refresh_token",
    //   // client_id: "6A6239ABF4834F2AA252940D49067EA8",
    //   // refresh_token: "f95f262ea98fb8ee22b1ba478e7d42855ff15a7268a4295560bb268b54247bb3"
    // };
    //
    // var formBody = [];
    // for (var property in params) {
    //   var encodedKey = encodeURIComponent(property);
    //   var encodedValue = encodeURIComponent(params[property]);
    //   formBody.push(encodedKey + "=" + encodedValue);
    // }
    // formBody = formBody.join("&");
    //
    // fetch("https://cors-anywhere.herokuapp.com/https://identity.xero.com/connect/token", {
    //   method: 'Post',
    //   headers:{
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   },
    //   body: formBody
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))

   // API.get("kudosAPI","/general/refreshToken", '').then(response => this.setState({refresh_token:response.body[response.body.length - 1]}))

    // fetch("https://cors-anywhere.herokuapp.com/https://identity.xero.com/connect/token", {
    //   method: 'Post',
    //   headers:{
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   },
    //   body: formBody
    // })
    //     .then(response => response.json())
    //     .then(data =>
    //         {
    //           let option = {
    //             body:data
    //           }
                 {/* API.post("kudosAPI","/general/refreshToken", option).then(response => this.setState({refresh_token:response})) */}
    //           localStorage.setItem('refreshtoken',data.access_token)
    //         }
    //     )



    // localStorage.setItem('token',JSON.stringify({
    //   access_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE1OTcyNDAyMzgsImV4cCI6MTU5NzI0MjAzOCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiNkE2MjM5QUJGNDgzNEYyQUEyNTI5NDBENDkwNjdFQTgiLCJzdWIiOiI1NTI0ZjhmZmQ0NmE1NzkxYjU4ZDdjM2ZmMjhkYTBjZSIsImF1dGhfdGltZSI6MTU5NzIzNTI1MCwieGVyb191c2VyaWQiOiJlNzNkYzg5YS1jZDdiLTQ5ZDktYjNhMi00NTlkOTdjMzEyZjIiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImZkZDU0MGY0ODA3YzQzMjRiNWRhMjBkYWZkMTliMjdkIiwianRpIjoiZDg1Njg1YzQzYWE5YzM1ZmRjNmE2YzM1NjM0MDA2YWIiLCJhdXRoZW50aWNhdGlvbl9ldmVudF9pZCI6ImMyMGJmZmYyLTQzNTgtNGE3NC1iMjJhLWQ4NGQ0M2Y5YmY5YiIsInNjb3BlIjpbImVtYWlsIiwicHJvZmlsZSIsIm9wZW5pZCIsImFjY291bnRpbmcudHJhbnNhY3Rpb25zIiwib2ZmbGluZV9hY2Nlc3MiXX0.o9_h9NJMgz3_NaTDAv3PmaHj3naSTZVzyai9LXGDRJOQmv89M_dxvka_QVr08Vjv22JuoAUKnrms_HLadYs1uPXQcazVkPSNKgDjxWkX7fA9ovanX8zz5a27-DanJdg13DA4dZ9-ncw1nvdY2_5tkR9tbqa4pbDfkMgQCAijBRXjHFHSftF_u9rkPjGlNbp1ztJiHTaWB9xwdNJO5QghUNfOZ1Jxc7yWRFv22HFDXnZWoNI7VU49B0iZ-CIZ8lCmJb7xIZdxr1HtzN_BRRnpztUpdwzqi6-ePfETxiGsJy8aLZ0JcFBT4wivLYsvfPuNw8LVwPz52Gl269byuezKMg",
    //   expires_in: 1800,
    //   id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE1OTcyNDAyMzgsImV4cCI6MTU5NzI0MDUzOCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6IjZBNjIzOUFCRjQ4MzRGMkFBMjUyOTQwRDQ5MDY3RUE4IiwiaWF0IjoxNTk3MjQwMjM4LCJhdF9oYXNoIjoiYUtHb2RLY3YzTDhmbW1KMzIxRDJfdyIsInNpZCI6ImZkZDU0MGY0ODA3YzQzMjRiNWRhMjBkYWZkMTliMjdkIiwic3ViIjoiNTUyNGY4ZmZkNDZhNTc5MWI1OGQ3YzNmZjI4ZGEwY2UiLCJhdXRoX3RpbWUiOjE1OTcyMzUyNTAsInhlcm9fdXNlcmlkIjoiZTczZGM4OWEtY2Q3Yi00OWQ5LWIzYTItNDU5ZDk3YzMxMmYyIiwiZ2xvYmFsX3Nlc3Npb25faWQiOiJmZGQ1NDBmNDgwN2M0MzI0YjVkYTIwZGFmZDE5YjI3ZCIsInByZWZlcnJlZF91c2VybmFtZSI6Im1pY2hhZWxAa3Vkb3Njb2RlLmNvbSIsImVtYWlsIjoibWljaGFlbEBrdWRvc2NvZGUuY29tIiwiZ2l2ZW5fbmFtZSI6Ik1pY2hhZWwiLCJmYW1pbHlfbmFtZSI6IlNjaHdlbmdlbCJ9.S9tIfzWVysW79Nz64Ixryd1smKMvNf7xAdJ9YP-SCnafhy1hTMdeNk-BqWl1Ed54WLRmaexPBXjfQ4yIa3EO2jSSSyLgAZpPLBEa8wXviCwWPXzShCrpeW4fiteHghcR6iG2nB-ht4lDb7T8WfyesaS7dx-myv1f6EYRyseefRuMWFFWhW0dBLNmyM0Dd5wYfu6g3VsszsY8FfPhnAp1TZCbdPAMlagJKMh8I2J_5GV1Mec23ScolxvjMdZoO3LS-pz7Fz7lVxRsiFBKyUsULwsPBGncfVdtHZMocY8Nnp7kdJzx0TW54sw1j-3HxbXNP9cZE-C11gO6_wfP0mj-HQ",
    //   refresh_token: "d97c7c876300ca0ac8b0858a34ebb96f2c93198a5648ed2e133cd303fd0c7041",
    //   scope: "openid profile email accounting.transactions offline_access",
    //   token_type: "Bearer"
    // }))
  }


  callbackFunction = ()=>{
    console.log('done');

  }


    


  render() {

    const Nav = [
      {name:'About Kudos Code', slug:'', url:'/', auth:"0"},
      {name:'Dashboard', slug:'dashboard', url:'/dashboard', auth:"1"},
      {name:'Project', slug:'projects', url:'/dashboard', auth:"1"},
      {name:'Support', slug:'sites', url:'/dashboard', auth:"1"},
      {name:'Account', slug:'account', url:'/dashboard', auth:"1"},
    ]

    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
    };
    const match = this.props;

    return (

      <div className="App">
        <Router>
          <div>
            <Header nav={Nav} auth={authProps}/>
            <Switch>
              <Route exact path="/" render={(props) => <Home />} />
              <Route exact path="/tokenUpdate" render={(props) => <TokenUpdate {...props} auth={authProps} />}/>
              <Route exact path="/api" render={(props) => this.callbackFunction(props) } />
              <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} isLogin={(e)=>this.getLoginDetails(e)} />} />
              <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
              <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
              <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
              {
                authProps.isAuthenticated &&
                <>
                        <Route exact path="/dashboard/" render={(props) => <Dashboard {...props}   auth={admin}  tw_company={localStorage.getItem('tw_company')}  sub_companies={localStorage.getItem('sub_companies')} data={localStorage.getItem('company')} />} />
                        <Route exact path="/company/:company_id/projects/:project_id" render={(props) => <Projects {...props} auth={admin} company={localStorage.getItem('company')} sub_companies={localStorage.getItem('sub_companies')} tw_company={localStorage.getItem('tw_company')} token={this.state.access_token} />} />
                        <Route exact path="/support/:support_id/projects/:project_id" render={(props) => <Supports {...props} auth={admin} company={localStorage.getItem('company')} sub_companies={localStorage.getItem('sub_companies')} tw_company={localStorage.getItem('tw_company')} token={this.state.access_token} />} />
                        <Route exact path="/support/:support_id/projects/:project_id/add" render={(props) => <AddSupports {...props} auth={admin}  user={this.state.user} />} />
                        <Route exact path="/support/:support_id/projects/:project_id/detail/:detail_id" render={(props) => <SupportDetails {...props} auth={admin} user={this.state.user} />} />
                        <Route exact path="/company/:company_id/projects/:project_id/detail/:detail_id" render={(props) => <Details {...props} auth={admin} user={this.state.user} />} />
                        <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} />}/>
                        <Route exact path="/letsgo" render={(props) => <LetsGo {...props} auth={authProps} />} />
                        <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />} />
                        <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />

                </> 
                }
                <Route exact path="/*" render={(props) => <LogIn {...props} auth={authProps} isLogin={(e)=>this.getLoginDetails(e)} />} />
              

            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;