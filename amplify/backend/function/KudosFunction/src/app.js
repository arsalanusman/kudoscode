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
var moment = require('moment');
const cheerio = require('cheerio')


//Aws Data
var AWS = require('aws-sdk');
var awsCredentials = {
    region : 'us-east-1',
    accessKeyId: 'AKIA4PSU75HUHWV3DIP2',
    secretAccessKey: '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'
}
//End Aws Data

//Node Email
var nodemailer = require('nodemailer');
var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dev@kudoscode.com',
    pass: 'fNlmXSAMTrms'
  }
});

function TimeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "." + rminutes ;
}

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


    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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

    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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

    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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
                                MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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

                                                                    db.collection('companies').update({
                                                                        code: company_code,
                                                                        "projects.code": project_code
                                                                    }, {$addToSet: {"projects.$.invoiceId": inv.InvoiceID}})

                                                                }

                                                            })
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
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
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



app.post('/general/send', function(req, res) {
  var $ = cheerio.load(req.body.body.replace(/<!--|-->/g, ''))
    var str = $('.gmail_quote').text()
    var sk = str.split('#')
    var kd = sk[1].split('|') 
    console.log(kd[0],kd[1],kd[2])


    var sf = $('div[dir="ltr"]').eq(0).text()
     
    console.log(sf)
    console.log(req.body)

    var str2 = $('.gmail_quote').remove()


    res.send(200)
});


app.post('/general/comment', function(req, res) {

    let emails = []
    var requestData = req.body
    var id = requestData.comment['projectId']
    MongoClient.connect("mongodb+srv://KudosCode:gysdZVbmzmV5K9Jy@cluster0.zd0xl.mongodb.net/", { useUnifiedTopology: true })
    .then(client => {

        db = client.db('kudos_code')
        db.collection('companies').find({$or:[{"projects.tw_projectID":id.toString()},{"supportbin.tw_projectID":id.toString()}]}).toArray().then(res =>  
        {
        console.log(res)
        res && res.map((comp_id) => {
            let parentID = comp_id.parent_company_id

            db.collection('companies').find({"_id":ObjectId(parentID)}).toArray().then(com => {
                   
            let cm = com[0]._id.toString()
            console.log('com',cm)
            var params = {
              UserPoolId: 'us-east-1_Mvqs4FMAy',
              GroupName: cm
            };
            return new Promise((resolve, reject) => {
                    AWS.config.update({ region: awsCredentials.region, 'accessKeyId': awsCredentials.accessKeyId, 'secretAccessKey': awsCredentials.secretAccessKey });
                    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                    cognitoidentityserviceprovider.listUsersInGroup(params, (err, data) => {
                        if (err) {
                            //console.log(err);
                            reject(err)
                        }
                        else {
                            data.Users.map((items)=> items.Attributes.filter(attr  => attr.Name == 'email').map((attrMap)=> 

                                 {      
                                     emails.push(attrMap.Value)
                                     console.log('Users', data.Users)

                                     var collection = []
                                        request({
                                                method: 'Get',
                                                uri: admin.baseUrl+"/tasks/"+requestData.comment['objectId']+".json",
                                                headers: {
                                                    'Authorization': 'Basic ' + Buffer.from(admin.username + ':' + admin.password).toString('base64'),
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'X-Requested-With':'XMLHttpRequest'
                                                }
                                            }, (error, response, body) => {
                                                request({
                                                    method: 'Get',
                                                    uri: admin.baseUrl+"/people/"+requestData.comment['userId']+".json",
                                                    headers: {
                                                        'Authorization': 'Basic ' + Buffer.from(admin.username + ':' + admin.password).toString('base64'),
                                                        'Content-Type': 'application/x-www-form-urlencoded',
                                                        'X-Requested-With':'XMLHttpRequest'
                                                    }
                                                }, (user_error, user_response, user_body) => {

                                                    collection.push({user:user_body,project:body})


                                                    var collectionProject = JSON.parse(collection[0].project)
                                                    var collectionUser = JSON.parse(collection[0].user)
                                                    var collectionProjectJson = collectionProject['todo-item']
                                                    var collectionUserJson = collectionUser['person']


                                                    console.log('collectionProjectJson',collectionProjectJson)
                                                    console.log('collectionUserJson',collectionUserJson)
                                                    console.log('requestData',requestData)

                                                    var taskUrl = "https://work.kudoscode.com/#/tasks/"+requestData.comment['objectId']+"?c="+requestData.comment['id']

                                                    var mailOptions = {
                                                          from: 'dev@kudoscode.com',
                                                          to: attrMap.Value,
                                                          subject: '(Kudoscode) - ' + requestData.eventCreator.firstName + ' has comment.',
                                                          html: (`
                                                            <div class="message"></div>
                                                            <br/><br/>      
                                                            <div class="details" style="color:#333;border: 1px solid #ccc;background: #fff;padding: 20px 30px;">
                                                                <div style="padding: 0 15px;">
                                                                <p style="color:#333;font-size: 16px;">===== WRITE YOUR REPLY ABOVE THIS LINE =====</p>
                                                                <table style="color:#333;font-size: 14px;line-height: 8px;width: 100%;">
                                                                    <tr>
                                                                        <td>
                                                                            <h3 style="margin-bottom: 22px;font-size: 18px;text-decoration: underline;"><a href="${taskUrl}" target="_new" style="color: blue;">${collectionProjectJson['content']}</a></h3>
                                                                            <p style="color:#333;"><strong>${collectionProjectJson['project-name']}</strong></p>
                                                                            <p style="color:#333;">${com[0].name} | ${comp_id.name}</p>
                                                                        </td>
                                                                        <td style="text-align:right">
                                                                            <p><div style="display:inline-block;border:1px solid #ccc;height:18px;padding: 1px 10px 6px;background:#f1f1f1;font-weight:bold;font-size:12px;line-height: 25px;"><hr style="width:11px;height:11px;background: ${collectionProjectJson.boardColumn.color};float:left;border-radius:100px;margin-right:5px;border:0;margin-top: -2px;" />${collectionProjectJson.boardColumn.name}</div></p>
                                                                            <p style="color: #ccc;font-size: 13px;">${moment(requestData.comment['dateCreated']).format('MMM DD')} </p>
                                                                            <p style="color: #ccc;font-size: 13px;">${moment(requestData.comment['dateCreated']).format('LT')}</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                </div>
                                                                <hr style="border: 0;border-bottom: 2px solid #ccc;" />

                                                                <div style="padding: 0 15px;">
                                                                <div style="font-size:15px;padding: 10px 0px;margin-bottom: 11px;">${requestData.comment['body']}</div>
                                                                <table style="width: 100%;margin-bottom: 15px;">
                                                                    <tr>
                                                                        <td>
                                                                            <h3 style="margin: 0;font-size: 18px;"><strong>${collectionUserJson['first-name']} ${collectionUserJson['last-name']}</strong></h3>
                                                                            <h3 style="font-size: 22px;margin: 0;font-weight: normal;">${collectionUserJson['title']} </h3>
                                                                        </td>
                                                                        <td style="text-align:right">
                                                                            <img src="https://master.d33j192frolooo.amplifyapp.com/static/media/logo.028d0cad.png" width="170" />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                </div>`)};

                                                                    request({
                                                                        method: 'Get',
                                                                        uri: admin.baseUrl+"/comments/"+requestData.comment['id']+".json",
                                                                        headers: {
                                                                            'Authorization': 'Basic ' + Buffer.from(admin.username + ':' + admin.password).toString('base64'),
                                                                            'Content-Type': 'application/x-www-form-urlencoded',
                                                                            'X-Requested-With':'XMLHttpRequest'
                                                                        }
                                                                    }, (comment_error, comment_response, comment_body) => {
                                                                        let cm = JSON.parse(comment_body)
                                                                        

                                                                        if(cm['comment'].private  == 0){
                                                                            if(collectionUserJson.companyId == 132027){
                                                                            
                                                                                if(collectionProjectJson.tags[0].id == 79803){
                                                                                    mail.sendMail(mailOptions, function(error, info){
                                                                                          if (error) {
                                                                                            console.log(error);
                                                                                             res.send(401)
                                                                                          } else {
                                                                                             res.json({body:mailOptions})
                                                                                             res.send(200)
                                                                                            console.log('Email sent: ' + info.response);
                                                                                          }
                                                                                    });  
                                                                            }
                                                                        }}
                                                                    
                                                                    })



                                                            })

                                                        })
                                                    }
                                                ));
                                            resolve(data)
                            
                                         }
                                    })
                                });
                            })
           
                        })
                    })
   
            })
});


    

app.listen(3003, function() {

    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
