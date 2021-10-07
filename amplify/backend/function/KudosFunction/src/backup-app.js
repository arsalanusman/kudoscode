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
var crypto = require('crypto')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var fs = require('fs');

const clientId = '23F5DBF707FF4EC6817274257D242EA1'
const clientSecret = 'IUgn7mIp42LmlSSo_4ikUgglhWZQvpEaygKMn7qL0cx0Ku-S'


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
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
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

app.post('/webhooks', itrBodyParser, function(req, res) {

    let lastestFreshToken = null

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
                        console.log(body)
                        if (error) {
                            console.log(error);
                        } else {
                            if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                                MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
                                    .then(client => {
                                        db = client.db('kudos_code')
                                        db.collection('invoice_token').insert(body)
                                            .then(result => {
                                                //lastestFreshToken = result
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
    console.log(lastestFreshToken)

    // let projects = []
    // MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
    //     .then(client => {
    //         db = client.db('kudos_code')
    //         db.collection('companies').find({}).toArray()
    //             .then(result =>
    //                 { result.map(pro =>
    //                     pro.projects && pro.projects.map(items => console.log(items.name.split(': ').pop()) )
    //                 )
    //                 }
    //             )
    //             .catch(error => console.error(error))
    //     });
    // MongoClient.connect("mongodb+srv://arsalan:arsalan0341@cluster0-n34cz.mongodb.net/", { useUnifiedTopology: true })
    //     .then(client => {
    //         db = client.db('kudos_code')
    //         db.collection('invoice_token').find({}).toArray()
    //             .then(result =>
    //                 {
    //
    //                 }
    //             )
    //             .catch(error => console.error(error))
    //     });
    // fs.writeFile('log.txt', JSON.stringify([req.body, req.headers]), function (err) {
    //     if (err) throw err;
    //     console.log('File is created successfully.');
    // });


    // Add your code here
    //console.log("Body: "+ JSON.stringify(req.body))
    //console.log("Body: "+ req.body.toString())

    console.log("Xero Signature: "+req.headers['x-xero-signature'])

    //let data = '{"events": '+JSON.stringify(req.body['events'])+',"firstEventSequence": '+JSON.stringify(req.body['firstEventSequence'])+',"lastEventSequence": '+JSON.stringify(req.body['lastEventSequence'])+',"entropy": '+JSON.stringify(req.body["entropy"])+'}'
    //let data = '{"events": '+JSON.stringify(req.body['events'])+',"firstEventSequence": '+JSON.stringify(req.body['firstEventSequence'])+',"lastEventSequence": '+JSON.stringify(req.body['lastEventSequence'])+',"entropy": '+JSON.stringify(req.body["entropy"])+'}'

    let data2 = "{\"events\":[{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-25T08:20:45.878\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T07:51:46.503\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:00:20.83\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:01:23.768\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:02:14.862\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:08:11.502\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:00:17.657\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:10:45.91\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:30:06.346\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:32:22.861\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:34:00.86\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:38:30.831\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/536acf12-afd4-4d90-90ca-f1bc4de64df5\",\n  \"resourceId\": \"536acf12-afd4-4d90-90ca-f1bc4de64df5\",\n  \"eventDateUtc\": \"2020-08-26T11:42:59.703\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"resourceId\": \"a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"eventDateUtc\": \"2020-08-26T11:44:58.015\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"resourceId\": \"a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"eventDateUtc\": \"2020-08-26T11:48:51.874\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n}],\"firstEventSequence\": 1,\"lastEventSequence\": 15, \"entropy\": \"BEVNQUUXERJSYCDXCZFT\"}"
    let data3 = '{"events":[{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-25T08:20:45.878","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"},{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-26T07:51:46.503","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"},{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-26T08:00:20.83","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"},{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-26T08:01:23.768","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"},{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-26T08:02:14.862","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"},{"resourceUrl":"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2","resourceId":"9e62d81c-75d8-4905-b710-271ea784e6e2","eventDateUtc":"2020-08-26T08:08:11.502","eventType":"UPDATE","eventCategory":"INVOICE","tenantId":"a3210e21-26d4-499c-831e-4e81e3e538cc","tenantType":"ORGANISATION"}],"firstEventSequence": 1,"lastEventSequence": 6, "entropy": "XJHEUYAFPVUZPBEEISSL"}'
    //let data3 = '{"events":'+JSON.stringify(req.body['events'])+',"firstEventSequence": 1,"lastEventSequence": 6, "entropy": "XJHEUYAFPVUZPBEEISSL"}'


    //console.log(JSON.stringify(req.body))

    const evnt = req.body['events'].map((items)=>{
       return '{\n  \"resourceUrl\": \"'+items['resourceUrl']+'\",\n  \"resourceId\": \"'+items['resourceId']+'\",\n  \"eventDateUtc\": \"'+items['eventDateUtc']+'\",\n  \"eventType\": \"'+items['eventType']+'\",\n  \"eventCategory\": \"'+items['eventCategory']+'\",\n  \"tenantId\": \"'+items['tenantId']+'\",\n  \"tenantType\": \"'+items['tenantType']+'\"\n}'
    })
    let data4 = '{\"events\":['+evnt+'],\"firstEventSequence\": '+req.body['firstEventSequence']+',\"lastEventSequence\": '+req.body['lastEventSequence']+', \"entropy\": \"'+req.body['entropy']+'\"}'

    //console.log(JSON.stringify(data4))

   // let data5 = "{\"events\":[{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-25T08:20:45.878\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T07:51:46.503\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:00:20.83\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:01:23.768\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:02:14.862\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T08:08:11.502\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:00:17.657\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:10:45.91\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:30:06.346\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:32:22.861\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:34:00.86\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"resourceId\": \"9e62d81c-75d8-4905-b710-271ea784e6e2\",\n  \"eventDateUtc\": \"2020-08-26T11:38:30.831\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/536acf12-afd4-4d90-90ca-f1bc4de64df5\",\n  \"resourceId\": \"536acf12-afd4-4d90-90ca-f1bc4de64df5\",\n  \"eventDateUtc\": \"2020-08-26T11:42:59.703\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"resourceId\": \"a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"eventDateUtc\": \"2020-08-26T11:44:58.015\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n},{\n  \"resourceUrl\": \"https://api.xero.com/api.xro/2.0/Invoices/a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"resourceId\": \"a2307224-49da-4a5d-8c74-2143f0a1710f\",\n  \"eventDateUtc\": \"2020-08-26T11:48:51.874\",\n  \"eventType\": \"UPDATE\",\n  \"eventCategory\": \"INVOICE\",\n  \"tenantId\": \"a3210e21-26d4-499c-831e-4e81e3e538cc\",\n  \"tenantType\": \"ORGANISATION\"\n}],\"firstEventSequence\": 1,\"lastEventSequence\": 15, \"entropy\": \"CQTBVIZUHLSCCTTYQHNG\"}"
    // console.log("events",data)

    // Create our HMAC hash of the body, using our webhooks key
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
