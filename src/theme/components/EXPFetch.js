import { encode } from "base-64";
export default async function (...args) {
    const admin = {
        baseUrl: 'https://work.kudoscode.com',
        username: 'dev@kudoscode.com',
        password:'R7!W6$4pxFoT8sR'
    }
    const res = await fetch(...args,{
        headers: new Headers({
            'Authorization': 'Basic ' + encode(admin.username + ':' + admin.password),
            'Content-Type': 'application/json'
        }),
    })
    return res.json()
}