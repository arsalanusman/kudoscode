/*
 Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
 */


/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 Amplify Params - DO NOT EDIT */


var express = require('express')
var bodyParser = require('body-parser')
var request = require('request-promise')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var crypto = require('crypto')

//Node Gmail
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const urlParse = require('url-parse');
const queryParse = require('query-string')



var MongoClient = require("mongodb").MongoClient;
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

ObjectId = require('mongodb').ObjectID;
// Enable CORS for all methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


const xero_webhook_key = '/JxpHONJbxa3chhI5VL0A9if700fen/HqpP5N3Jt7GYQyP6CXfhT9TjthHtdpvJAV/0SPThL0qqz2GhvEhMcBg=='
var options = {
    type: 'application/json'
};
var itrBodyParser = bodyParser.raw(options)

function encodeBody(params) {
    var formBody = [];
    for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}
const admin = {
    baseUrl: 'https://work.kudoscode.com',
    username: 'dev@kudoscode.com',
    password:'R7!W6$4pxFoT8sR'
}

/**********************
 * Login  *
 **********************/


app.post('/login', function(req, res) {


    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            console.log('Connected to Database')
            cont = 'Connected to Database';
            db = client.db('test')
            quotesCollection = db.collection('people')
            //const c = db.collection('people').find(query).toArray(function(err,arr){
            //      return arr
            //  });

            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.json({success: 'post call succeed!', url: req.url, body:req.body})
                })
                .catch(error => console.error(error))
        });

});

app.get('/login', function(req, res) {

    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('users').find({}).toArray()
                .then(result => {
                    console.log(result)
                    res.json({success: 'Successfully get users test', url: req.url, body:result})
                })
                .catch(error => console.error(error))
        });

});
app.post('/general', function(req, res) {
    // Add your code here
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('companies').findOne({"_id":ObjectId(req.body.id)})
                .then(result => {
                    res.json({success: 'Successfully',  url: req.url, body:result})
                })
                .catch(error => console.error(error))
        });
});
app.post('/general/sub_company', function(req, res) {
    // Add your code here
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('companies').find({"parent_company_id":ObjectId(req.body.parent_company_id)})
                .toArray(function(err, documents) {
                    res.json({success: 'Successfully',  url: req.url, body:documents})
                })
        });
});
app.post('/general/teamwork', function(req, res) {
    request({
        method: 'Get',
        uri: admin.baseUrl+req.body.url,
        headers: {
            'Authorization': 'Basic ' + Buffer.from(admin.username + ':' + admin.password).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With':'XMLHttpRequest'
        }
    }, (error, response, body) => {
        res.json({success: 'done!', body: JSON.parse(response.body)})
    })
})

app.post('/general/refreshToken', function(req, res) {
    // Add your code here
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('invoice_token').insertOne(req.body)
                .then(result => {
                    res.json({success: 'refreshToken inserted!', url: req.url, body:req.body})
                })
                .catch(error => console.error(error))
        });
});

app.get('/general/refreshToken', function(req, res) {
    // Add your code here
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('invoice_token').find({}).toArray()
                .then(result => {
                    res.json({success: 'Successfully get users test', url: req.url, body:result})
                })
                .catch(error => console.error(error))
        });
});





app.post('/general/getInvoices', function(req, res) {
    // Add your code here
    request({
        method: 'Get',
        uri: 'https://api.xero.com/api.xro/2.0'+req.body.url,
        headers: {
            'Authorization': 'Bearer '+ req.body.token ,
            'Accept': 'application/json',
            'Xero-tenant-id':'a3210e21-26d4-499c-831e-4e81e3e538cc'
        }
    }, (error, response, body) => {
        res.send(body)
    })
});


app.post('/general/getOnlineLink', function(req, res) {
    // Add your code here
    request({
        method: 'Get',
        uri: 'https://api.xero.com/api.xro/2.0'+req.body.url,
        headers: {
            'Authorization': 'Bearer '+ req.body.token ,
            'Accept': 'application/json',
            'Xero-tenant-id':'a3210e21-26d4-499c-831e-4e81e3e538cc'
        }
    }, (error, response, body) => {
        res.send(body)
    })
});

app.get('/general/refreshTokenGet', function(req, res) {
        console.log('testing3')
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
                 db = client.db('kudos_code')
                 db.collection('invoice_token').find({}).toArray()
                    .then(getToken => {

                        var params = {
                            grant_type: "refresh_token",
                            client_id: "6A6239ABF4834F2AA252940D49067EA8",
                            refresh_token: getToken[getToken.length - 1].refresh_token
                        }
                        console.log('testing2')

                        request({
                            method: 'POST',
                            uri: 'https://identity.xero.com/connect/token',
                            headers: {
                                // authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-Requested-With':'XMLHttpRequest'
                            },
                            body: encodeBody(params)
                            }, (error, response, body) => {
                                    if(body){
                                        db = client.db('kudos_code')
                                        db.collection('invoice_token').insertOne(JSON.parse(body))
                                        .then(result => {
                                             res.json({success: 'Successfully get users test', url: req.url, res:result.ops})
                                        })
                                    }
                                })
                             })
                    })
});

app.post('/webhooks', itrBodyParser,  function(req, res) {
    // Add your code here

    const evnt = req.body['events'].map((items)=>{
        return '{\n  \"resourceUrl\": \"'+items['resourceUrl']+'\",\n  \"resourceId\": \"'+items['resourceId']+'\",\n  \"eventDateUtc\": \"'+items['eventDateUtc']+'\",\n  \"eventType\": \"'+items['eventType']+'\",\n  \"eventCategory\": \"'+items['eventCategory']+'\",\n  \"tenantId\": \"'+items['tenantId']+'\",\n  \"tenantType\": \"'+items['tenantType']+'\"\n}'
    })
    let data4 = '{\"events\":['+evnt+'],\"firstEventSequence\": '+req.body['firstEventSequence']+',\"lastEventSequence\": '+req.body['lastEventSequence']+', \"entropy\": \"'+req.body['entropy']+'\"}'
    let hmac = crypto.createHmac("sha256", xero_webhook_key).update(data4.toString()).digest("base64");

    console.log("Resp Signature: "+hmac)
    if (req.headers['x-xero-signature'] == hmac) {
        res.statusCode = 200
    } else {
        res.statusCode = 401
    }
    console.log("Response Code: "+res.statusCode)

    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            db = client.db('kudos_code')
            db.collection('invoice_token').find({}).toArray()
                .then(getToken => {
                    var params = {
                        grant_type: "refresh_token",
                        client_id: "6A6239ABF4834F2AA252940D49067EA8",
                        refresh_token: getToken[getToken.length - 1].refresh_token
                    };
                    request({
                        method: 'POST',
                        uri: 'https://identity.xero.com/connect/token',
                        headers: {
                            // authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-Requested-With':'XMLHttpRequest'
                        },
                        body: encodeBody(params)
                    }, (error, response, body) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                                MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
                                    .then(client => {
                                        db = client.db('kudos_code')
                                        db.collection('invoice_token').insertOne(JSON.parse(body))
                                            .then(result => {
                                                req.body['events'].map((items)=>
                                                    request({
                                                        method: 'GET',
                                                        uri: items['resourceUrl'],
                                                        headers: {
                                                            'Authorization': 'Bearer '+result['ops'][0].access_token,
                                                            'Accept': 'application/json',
                                                            'Xero-tenant-id':'a3210e21-26d4-499c-831e-4e81e3e538cc'
                                                        }
                                                    },(error, response, body) => {
                                                        if (error) {
                                                            console.log('error',error);
                                                        } else {
                                                            if(items['eventType'] == 'CREATE'){
                                                            // console.log(response)
                                                            //  console.log(body)
                                                            var cd = JSON.parse(response.body);

                                                            var name = [];

                                                            cd.Invoices.map((inv)=> {

                                                                name.push({[inv.Reference.split(" Payment")[0]]: inv.InvoiceID})

                                                                let str = inv.Reference;
                                                                let project_code = str.match(/(?:[A-Z]{3}_)?[A-Z]{3}\d{3}/g);
                                                                let company_code = false;

                                                                if(project_code) {
                                                                    project_code = project_code.toString()

                                                                    project_code.length > 6 ?
                                                                        company_code = project_code.substring(0, 7)
                                                                        :  company_code = project_code.substring(0, 3)

                                                                    console.log(project_code)
                                                                    console.log(company_code)


//                                                                    let code = 'AGY-CLT1'
//                                                                    let projectCode = 'TST_ABC123'
                                                                    // console.log('company3', {code:code, "projects.code": projectCode }, {"projects.$.invoiceId": inv.InvoiceID })

                                                                    db.collection('companies').update({
                                                                        code: company_code,
                                                                        "projects.code": project_code
                                                                    }, {$addToSet: {"projects.$.invoiceId": inv.InvoiceID}})

                                                                }

                                                            })
                                                                // let com = []

                                                                // db.collection('companies').find({code:code}).toArray().then(companies =>{
                                                                //     companies.map(cp => cp.projects && cp.projects.map((pro,ind) =>
                                                                //        pro.code == projectCode &&
                                                                //         //code:cp.code, projectCode:pro.code, companyId:cp._id, invoiceId:inv.InvoiceID
                                                                //         console.log('company2', {_id:ObjectId(cp._id), "projects.code": pro.code }, {"projects.$.invoiceId": inv.InvoiceID })
                                                                //     ))})
                                                                //     // db.collection('companies').update({_id:ObjectId(coms.companyId), "projects.code": coms.projectCode }, {$push: {"projects.$.invoiceId": coms.invoiceId }})
                                                                //     //var compareNames = coms.map((comp) => { if(comp.projectCode.includes(Object.keys(name[0]))){return {...comp, }}else{ return false}})
                                                                //    // console.log('company', coms)
                                                                //
                                                                // })
                                                                // console.log('company',com)
                                                                // var compareNames = com.map((comp) => { if(comp.projectCode.includes(Object.keys(name[0]))){return {...comp, invoiceId:name[0]}}else{ return false}})
                                                                // console.log('not failed 2',compareNames)


                                                            // console.log('not failed',com)


                                                                // compareNames.map((cn) =>{
                                                                //     //let setPro = "projects."+cn.projectIndex+".invoiceId";
                                                                //     console.log('not failed 3',cn)
                                                                //     cn && db.collection('companies').update({_id:ObjectId(cn.companyId), "projects.code": cn.projectCode }, {$addToSet: {"projects.$.invoiceId": cn.invoiceId['TST_ABC123'] }})
                                                                //
                                                                // })

                                                                res.send()
                                                            }else{
                                                                res.send()
                                                            }




                                                        }
                                                    })

                                                )

                                                //console.log(ts)

                                            })
                                            .catch(error => console.error(error))
                                    });
                            } else {
                                console.log({ response: response, body: body });
                            }
                        }
                    });
                })
                .catch(error => console.error(error))
        });

    //


});
app.post('/webhooks/task', function(req, res) {
    // Add your code here
    MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
        .then(client => {
            console.log('Connected to Database')
            cont = 'Connected to Database';
            db = client.db('test')
            quotesCollection = db.collection('webhooks')
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.send(200)
                    res.json({success: 'post call succeed!', url: req.url, body: req.body})
                })
                .catch(error => console.error(error))
        });

});

//
//app.get('/general/gmail', async function(req, res) {
//    // Add your code here
//
//    const oauth2Client = new google.auth.OAuth2(
//        "624499497320-ea2seed1e1sm88r4fnu12ejgv1hepj0j.apps.googleusercontent.com",
//        "M2Tu-0Z9qijzUB4vFKzpD1Mc",
//        "http://localhost:3003/general/getEmail"
//    );
//
//
//    // generate a url that asks permissions for Blogger and Google Calendar scopes
//
//
////?code=4/4wFPSEpuCpGHOQea6Bs2EoUFzmY5tAXZnE5oNKKvWi0e7cEZcyCvj4-wpKUjMSF-KTeXgZmsdtlY9IJWnDE9Z3o
//
//    const url = oauth2Client.generateAuthUrl({
//        // 'online' (default) or 'offline' (gets refresh_token)
//        access_type: 'offline',
//        // If you only need one scope you can pass it as Sa string
//        scope: scopes,
//        state: JSON.stringify({
//            callbackUrl: req.body.callbackUrl,
//            userID: req.body.userid
//        })
//    });
//    const code = "4/4wHp8TnCvWieDDa6SgI4MirhPfHzPEgn8-e4KWymh0QlbsZ-KNxOXAidXZ6IcHHEkDUSqRmYPWCMgnlQ8JK2XLY"
//
//    request(url,(err,response,body)=>{
//        console.log('error',err)
//        console.log('statusCode', response && response.statusCode);
//        res.send({url})
//    })
//
//});
//
//app.get('/general/getEmail',  async function(req, res) {
//    console.log('test')
//    const queryUrl = new urlParse(req.url)
//    const code =  queryParse.parse(queryUrl.query).code;
//    const oauth2Client = new google.auth.OAuth2(
//        "624499497320-ea2seed1e1sm88r4fnu12ejgv1hepj0j.apps.googleusercontent.com",
//        "M2Tu-0Z9qijzUB4vFKzpD1Mc",
//        "http://localhost:3003/general/getEmail"
//    );
//    const token = await oauth2Client.getToken(code)
//
//    oauth2Client.on('tokens', (tokens) => {
//        if (tokens.refresh_token) {
//             // store the refresh_token in my database!
//            console.log(tokens.refresh_token);
//        }
//        console.log(tokens.access_token);
//    });
//    console.log(token)
//})
//
//
//
//
//const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
//const TOKEN_PATH = 'token.json';
//
//// Load client secrets from a local file.
//fs.readFile('credentials.json', (err, content) => {
//    if (err) return console.log('Error loading client secret file:', err);
//
//    // Authorize a client with credentials, then call the Gmail API.
//    authorize(JSON.parse(content), listLabels);
//});
//
//function authorize(credentials, callback) {
//    const {client_secret, client_id, redirect_uris} = credentials.installed;
//
//    const oAuth2Client = new google.auth.OAuth2(
//        client_id, client_secret, redirect_uris[0]);
//
//    getNewToken(oAuth2Client, callback)
//    // Check if we have previously stored a token.
////    fs.readFile(TOKEN_PATH, (err, token) => {
////        if (err) return getNewToken(oAuth2Client, callback);
////    oAuth2Client.setCredentials(token);
////    callback(oAuth2Client);
////
////});
//}
//
//function getNewToken(oAuth2Client, callback) {
//    const authUrl = oAuth2Client.generateAuthUrl({
//        access_type: 'offline',
//        scope: SCOPES,
//    });
//    console.log(oAuth2Client)
//    console.log('Authorize this app by visiting this url:', authUrl);
//    const rl = readline.createInterface({
//        input: process.stdin,
//        output: process.stdout,
//    });
//    rl.question('Enter the code from that page here: ', (code) => {
//        rl.close();
//    oAuth2Client.getToken(code, (err, token) => {
//        if (err) return console.error('Error retrieving access token', err);
//    oAuth2Client.setCredentials(token);
//    // Store the token to disk for later program executions
//    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//        if (err) return console.error(err);
//    console.log('Token stored to', TOKEN_PATH);
//});
//callback(oAuth2Client);
//});
//});
//}
//
//function listLabels(auth) {
//    const gmail = google.gmail({version: 'v1', auth});
//    gmail.users.labels.list({
//        userId: 'me',
//    }, (err, res) => {
//        if (err) return console.log('The API returned an error: ' + err);
//    const labels = res.data.labels;
//    if (labels.length) {
//        console.log('Labels:');
//        labels.forEach((label) => {
//            console.log(`- ${label.name}`);
//    });
//} else {
//    console.log('No labels found.');
//}
//});
//}
//

/**********************
 * End Login  *
 **********************/

app.listen(3003, function() {

    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = {
    app,
    SCOPES,
    listLabels,
}
