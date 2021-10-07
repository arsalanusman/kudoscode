import { encode } from "base-64";
import API from '@aws-amplify/api';
export default async function (...args) {
    const admin = {
        baseUrl: 'https://work.kudoscode.com',
        username: 'dev@kudoscode.com',
        password:'R7!W6$4pxFoT8sR'
    }
//    const res = await fetch(...args,{
//        headers: new Headers({
//            'Authorization': 'Basic ' + encode(admin.username + ':' + admin.password),
//            'Content-Type': 'application/json'
//        }),
//    })
//    return res.json()


    let apiName = 'kudosAPI';
    let path = '/general';
    let options = {
        body: {
            id: '5f2008d879219b33e066f7f4'
        }
    }

    let company = ''
    let subCompany = ''
    let companyDetail = ''

    API.post(apiName, path, options).then(response => {
        company =response.body
        if(response.body._id){
            var path = '/general/sub_company';
            var options = {
                body: {
                    parent_company_id: response.body._id
                }
            }
            API.post(apiName, path, options).then(sub => {
                subCompany = sub.body
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
        .then(data => companyDetail = data.company)
    });

    let res = {company:company,subCompany:subCompany,companyDetail:companyDetail}

    return res
}