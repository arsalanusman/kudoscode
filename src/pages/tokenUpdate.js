import React, {useState, useEffect} from 'react';
import {encode} from "base-64";
import API from "@aws-amplify/api";

const TokenUpdate = (props) => {

    const [accessToken, setAccessToken] = useState()

    useEffect(() => {
        API.get("kudosAPI","/general/refreshToken", '').then(response =>
        {
            var params = {
                grant_type: "refresh_token",
                client_id: "6A6239ABF4834F2AA252940D49067EA8",
                refresh_token: response.body[response.body.length - 1].refresh_token
            };

            var formBody = [];
            for (var property in params) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            fetch("https://cors-anywhere.herokuapp.com/https://identity.xero.com/connect/token", {
                method: 'Post',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            })
                .then(response => response.json())
                .then(tk =>
                    {
                        let option = {body:tk}
                        API.post("kudosAPI","/general/refreshToken", option).then(response =>  setAccessToken(response) )
                    }
                )
        })
    }, [])
    /**
     * @return {string}
     */
    return (
        <>
            {console.log(accessToken,'tokenCronJob')}
        </>
    );
}

export default TokenUpdate;
