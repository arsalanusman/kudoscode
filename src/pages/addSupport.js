import React,{useState,useEffect} from 'react';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import { encode } from "base-64";
import Table from '../theme/components/Table'
import Button from '../theme/components/Button'
import Card from '../theme/components/Card'
import Grid from '../theme/components/Grid'
import API from '@aws-amplify/api';
import { Link } from "react-router-dom";
import { FileDrop } from 'react-file-drop'
import { FileIcon, defaultStyles  } from 'react-file-icon';
import useSWR, { mutate, trigger } from 'swr'

//Testing SDF
const AddSupports = (props) => {

    const [fileUploadKey,setFileUploadKey] = useState([])
    const [textarea,setTextarea] = useState()
    const [success,setSuccess] = useState(false)
    const [title,setTitle] = useState()
    const [allowSubmit,setAllowSubmit] = useState(true)
    const [fileUpload,setFileUpload] = useState(false)
    const [fileNames,setFileNames] = useState([])

    const projectId = props.match.params.project_id;
    const companyId = props.match.params.support_id

    const  { data:tasklist } = useSWR("/tasklists/"+projectId + ".json")
    const { data:general,error:generalError } = useSWR("/general/")
    const { data:main_company,error:companyError } = useSWR("/company/")




    function addFile(x,v){

        let fileUrlName = v == "upload" ?  x.files :  x
        let fileUrl = ''
        let multifile = []
        const propertyNames = Object.values(fileUrlName)
        let allFile = []

        setAllowSubmit(false)
        if(propertyNames){
            propertyNames.map(file => {

                setFileUpload(true)
                fileUrl = "https://cors-anywhere.herokuapp.com/"+props.auth.baseUrl +"/projects/api/v1/pendingfiles/presignedurl.json?fileName="+ file.name +"&fileSize=undefined";

            fetch(fileUrl, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Basic ' + encode(props.auth.username + ':' + props.auth.password),
                    'Content-Type': 'application/json'
                })
            }).then(res => res.json())
        .then(res =>
                fetch(res.url, {
                    method: 'PUT',
                    body:file,
                    headers: new Headers({
                        'X-Amz-Acl': 'public-read',
                        'Content-Length': 'undefined',
                        'Host': 'tw-bucket.s3.amazonaws.com',
                    })
                }).then(resf =>{
                multifile.push(res.ref)
                allFile.push(file)
                 setFileNames(allFile)
                setFileUploadKey(multifile)
                console.log(fileUploadKey,'fileUploadKey')
                setAllowSubmit(true)
                setFileUpload(false)
        })
        );
        })
        }else{
            setAllowSubmit(true)
            setFileUpload(false)
            setFileNames([])
        }
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        if(textarea){
            setAllowSubmit(false)
            let comments_id = "/tasklists/"+projectId+"/tasks.json"
            let message = props.user.username+" \n "+props.user.attributes.email+" \n "+props.user.attributes.sub+" \n\n"+textarea

            fetch(props.auth.baseUrl + comments_id, {
                method: 'POST',
                body: JSON.stringify({'todo-item':{description:message,content:title,pendingFileAttachments:fileUploadKey ,'responsible-party-id':298053, 'columnId':294136, 'Content-Type': 'html'}}),
                headers: new Headers({
                    'Authorization': 'Basic ' + encode(props.auth.username + ':' + props.auth.password),
                    'Content-Type': 'html'
                })
            }).then(res => res.json()).then(res => {
                setTextarea('')
                setTitle('')
                setAllowSubmit(true)
                setFileUpload(false)
                trigger(comments_id)
                setFileUploadKey('')
                setSuccess(true)
                let url = props.match.url.replace('add','');
                let completeurl = url+'detail/'+res.id;
               props.history.push(completeurl)
            });
        }
    }
    return (
        <>

            <div className="container">
                <div className="row">
                    <Grid col="7">
                        <h1><em>Support</em></h1>
                    </Grid>
                    <Grid col="3" textAlign="right">
                        {main_company && main_company.company && main_company.company['logo-URL'] ?
                        <img src={main_company  && main_company.company && main_company.company['logo-URL']} className="attachment-medium size-medium" alt=""/> :
                         <h2> {general && general.company && general.company.name} </h2>}
                    </Grid>
                </div>
                <div className="row">
                    <Grid col="10">
                        <Card>
                            <div className="row">
                                <Grid col="8">
                                    <h4><Link to={'/dashboard/'}>{general && general.company && general.company.name}</Link></h4>
                                    <h2>{tasklist && tasklist['todo-list'] && tasklist['todo-list'].name}</h2>
                                </Grid>
                            </div>
                            <br />
                            <div className="row commentForm background_change">
                                <Grid col="10">
                                    <Card>
                                        <form onSubmit={handleSubmit} type="multipart/form-data">
                                            <h5 style={{textTransform:"capitalize"}}>{props.user && props.user.username}</h5>
                                              <input type="text" value={title} onChange={(e)=>{
                                                  setTitle(e.target.value)
                                                  setSuccess(false)
                                                  }} />
                                                <br/><br/>
                                                <SimpleMDE
                                                    id="message"
                                                    label=""
                                                    onChange={setTextarea}
                                                    value={textarea}
                                                    options={{
                                                        autofocus: true,
                                                        spellChecker: false
                                                        // etc.
                                                    }}
                                                />
                                            <FileDrop onDrop={(files, event) => addFile(files,'drag')}>
                                                <label>{fileUpload && <div><i className="fa fa-spinner fa-pulse"></i></div>} Drop some files here!
                                                    <input type="file" multiple onChange={(e)=> addFile(e.target,'upload')} className="hidden"/>
                                                </label>
                                            </FileDrop>
                                            <div className="comments">
                                                <div className="image-main">
                                                    {fileNames.length > 0 && fileNames.map((film) =>
                                                        <div className="image">
                                                            <FileIcon {...defaultStyles[film.name.substr(film.name.indexOf('.')).replace('.','')]} extension={film.name.substr(film.name.indexOf('.')).replace('.','')} type="document" />
                                                            <p>{film.name}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {success &&  <div className="successMessage">{"Successfully add your support request"}</div> }
                                            <div className="button-area sendButton">
                                                    {allowSubmit ?
                                                        textarea && title ? <Button type="primary" field="submit" title="Send" icon="" color="" />  : <button className="button secondary" style={{width:"100%"}}>Send</button>
                                                : <button className="button secondary" style={{width:"100%"}}>Send</button>}
                                            </div>
                                        </form>
                                    </Card>
                                </Grid>
                            </div>
                        </Card>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default AddSupports;
