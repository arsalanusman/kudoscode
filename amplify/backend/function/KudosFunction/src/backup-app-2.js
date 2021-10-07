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
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var crypto = require('crypto')

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
var request = require('request-promise')

function encodeBody(params) {
    var formBody = [];
    for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
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

app.post('/webhooks', itrBodyParser,  function(req, res) {
    // Add your code here
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
                                                console.log(result['ops'][0].access_token)
                                                console.log(req.body['events'])
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

    res.send()

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
/**********************
 * End Login  *
 **********************/

app.listen(3003, function() {

  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
