import { encode } from "base-64";
import Moment from 'react-moment';
import React, { Component }  from 'react';
import API from '@aws-amplify/api';
const admin = {
    baseUrl: 'https://work.kudoscode.com',
    username: 'twp_zh3uwC8M83JU55kQ8smEeKSRjTFg',
    password:'.'
}
var token = localStorage.getItem('access_token');

//General Fetch
export function Fetcher(url) {
    return fetch(admin.baseUrl + url, {
        method: 'Get',
        headers: new Headers({'Authorization': 'Basic ' + encode(admin.username + ':' + admin.password),'Content-Type': 'application/json'}),
    }).then(res => res.json())
};

//Get New Token
export function NewTokenGenerate(){
    return API.get("kudosAPI","/general/refreshTokenGet", '').then(response => token = response.res[0].access_token)
};

//Get Inovices
export function  GetInvoices(url){
    let option = {body: { token:token,url:url }}
    return API.post("kudosAPI","/general/getInvoices", option).then(response => response)
};

//Get Online Xero Link
export function  GetOnlineLink(url){
    let option = {body: { token:token,url:url }}
    return API.post("kudosAPI","/general/getOnlineLink", option).then(response => response)
};

//Rate Format
export function Formatter(num){
    let formatData =  new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(num)
    return formatData
};

//Date Format
export function MomentFormat(props){
   return <Moment format="MMM D, YYYY">{props.children}</Moment>
};

//Time Convert
export function TimeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "." + rminutes ;
}
