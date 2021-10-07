import React,{useState,useEffect} from 'react';


import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { encode } from "base-64";
import Table from '../theme/components/Table'
import Card from '../theme/components/Card'
import Grid from '../theme/components/Grid'
import Button from '../theme/components/Button'
import  fetchData from '../theme/components/Fetch'
import API from '@aws-amplify/api';
import { Link } from "react-router-dom";
import useSWR, { mutate, trigger, useSWRInfinite } from 'swr'
import { FileIcon, defaultStyles  } from 'react-file-icon';
import { FileDrop } from 'react-file-drop'
import { Fetcher, MomentFormat } from './Global'
import Moment from 'react-moment';

const Details = (props) => {

    const [textarea,setTextarea] = useState()
    const [loading,setLoading] = useState(true)
    const [loadingMore,setLoadingMore] = useState(true)
    const [allowSubmit,setAllowSubmit] = useState(true)
    const [latestComment,setLatestComment] = useState(true)
    const [fileUploadKey,setFileUploadKey] = useState([])
    const [fileUpload,setFileUpload] = useState(false)
    const [fileNames,setFileNames] = useState([])

    let project_link = "/tasks/"+props.match.params.detail_id+".json"

    const { data:general,error:generalError } = useSWR("/general/")
    const { data:main_company,error:companyError } = useSWR("/company/")
    const  { data: project } =  useSWR(project_link, Fetcher)

    const projectItem = project && project['todo-item']

    const getKey = (pageIndex, previousPageData) => {
        let pageIndexIn = pageIndex+1
        return "/v/2/tasks/"+props.match.params.detail_id+"/comments.json?page="+pageIndexIn+"&pageSize=5&orderBy=date&sortOrder=desc"                    // SWR key
    }

    function App () {
        const { data, size, setSize, isValidating, error } = useSWRInfinite(getKey, Fetcher)
        if (!data) return <button className="button center"> Loading... </button>
        // We can now calculate the number of all users
        let dbst = data

        let totalUsers = 0
        for (let i = 0; i < data.length; i++) {
            totalUsers += data[i].comments.length
        }
        let first = data[0].comments
        setLatestComment(first[0])

        let ds = dbst && dbst[dbst.length - 1].comments

        return <div>
            {data.map((comments, index) => {
                return comments.comments.map((comment,index) =>  <Comments data={comment} key={index} />  )
            })}
            {ds.length > 0 ?
                !isValidating ?
                    <button className="button center" onClick={() => setSize(size + 1) }>Load More</button> : <button className="button secondary center">Loading...</button>
             : "" }
        </div>
    }



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

    const File = props => {
        let file_id = "/files/"+props.data.fileId+"/sharedlink.json"
        const  { data: fileLink } =  useSWR(file_id, Fetcher)

       if(fileLink){
           return <div className="image"><a href={fileLink.url} target="_blank"> <FileIcon {...defaultStyles[props.data.extension]} extension={props.data.extension} type="document" /> <div className="fileDetail"><p>{props.data.filename} <br/><span>by {props.author}, <Moment fromNow>{props.data.uploadedDate}</Moment> , {props.data.size}kb </span> </p></div> </a></div>
        }else{
           return ""
       }

    }


    const Comments =  props => {
        //load more comments
        let data = props.data;
        let message = data['body']

        const parts = message && message.replace(/(<([^>]+)>)/gi, "");
        const partss = parts && parts.split(" ");

        let sd = partss
        let sds = ''
        var res = ''
        if(data.author){
            if(data.author['id'] == "298053"){
                res = sd && sd[1] && sd[1].charAt(0)
            }else{
                var fs = data.author['fullName']
                var fsWk = fs.split(' ')
                var first = fsWk[0]
                var last = fsWk[1]
                res = first.charAt(0)+last.charAt(0)
            }
        }
        var dateTime =  data['latChangedOn'] && data['lastChangedOn'].split('T')

        return  <div style={{marginBottom:'20px'}} key={props.key}><Card><div className="comments"><h5><div className="iconName">{res}</div><p> {sd ? sd[1] : data.author && data.author['fullName']} ( <MomentFormat>{dateTime && dateTime[0]}</MomentFormat> )</p> </h5> <div className="comments-body" dangerouslySetInnerHTML={{__html: data['body']}}></div>  {data.attachments && <div className="image-main"> {data.attachments.map((attch)=> <File data={attch} author={sd ? sd[1] : data.author && data.author['fullName']} />)}</div>}</div></Card></div>

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(textarea){
            setAllowSubmit(false)
            let comments_id = "/tasks/"+props.match.params.detail_id+"/comments.json"
            let message = "<div class='username'>"+props.user.username+"</div><div class='email'>"+props.user.attributes.email+"</div><div class='sub'>"+props.user.attributes.sub+"</div></div><br />"+draftToHtml(convertToRaw(textarea.getCurrentContent()))

            fetch(props.auth.baseUrl + comments_id, {
                method: 'POST',
                body: JSON.stringify({comment:{body:message,pendingFileAttachments:fileUploadKey ,'Content-Type': 'html'}}),
                headers: new Headers({
                    'Authorization': 'Basic ' + encode(props.auth.username + ':' + props.auth.password),
                    'Content-Type': 'html'
                })
            }).then(res => {
                setTextarea('')
                setAllowSubmit(true)
                setFileUpload(false)
                trigger(comments_id)
                setFileUploadKey('')
                setFileNames([])

                var notification = {
                    body:{
                        "details":projectItem,
                        "message":draftToHtml(convertToRaw(textarea.getCurrentContent())),
                        "username":props.user.username,
                        "email":props.user.attributes.email,
                        "userId":props.user.attributes.sub
                    }
                }
                API.post("kudosAPI","/general/notification", notification).then(response => response)

             });
        }
    }


/**
     * @return {string}
     */
    return (
        <>

            <div className="container">
                <div className="row">
                    <Grid col="7">
                        <h1><em>Projects</em></h1>
                    </Grid>
                    <Grid col="3" textAlign="right">
                        {main_company && main_company.company['logo-URL'] ?
                        <img src={main_company && main_company.company['logo-URL']} className="attachment-medium size-medium" alt=""/> :
                        <h2> {general && general.company && general.company.name} </h2>}
                    </Grid>
                </div>
                <div className="row">
                    <Grid col="10">
                        <Card>
                            {projectItem &&
                            <>
                                <div className="row">
                                    <Grid col="8">
                                        <h4><Link to={'/dashboard/'}>{general && general.company && general.company.name}</Link></h4>
                                       <h2><a onClick={()=>props.history.goBack()}>{ projectItem['project-name'] }</a></h2>
                                    </Grid>
                                    <Grid col="2">
                                        <h4>
                                        </h4>
                                    </Grid>
                                </div>

                                <div className="row">
                                    <table className="tablesorter eael-data-table center">
                                        <thead>
                                            <tr className="table-header">
                                                <th width="60%" className="" id="" colSpan=""> <span className="data-table-header-text"><i class="fas fa-folder data-header-icon"></i> Open Tasks</span></th>
                                                <th className="" id="" colSpan=""> <span className="data-table-header-text">Due Date</span></th>
                                                <th className="" id="" colSpan=""  style={{textAlign:"right"}}>  <span className="data-table-header-text">Status</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{projectItem['content']}</td>
                                                <td>
                                                    {projectItem['due-date'] ? <MomentFormat>
                                                        {projectItem['due-date'].slice(4, 6) +'/'+ projectItem['due-date'].slice(6, 8) +'/'+ projectItem['due-date'].slice(0, 4)}
                                                </MomentFormat> : 'Not Set'}
                                                </td>
                                                <td  className='status'  style={{textAlign:"right"}}> {projectItem['boardColumn'] && <> <i class="fa fa-circle" style={{color:projectItem['boardColumn'].color}}></i>  {projectItem['boardColumn'].name}</>}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {projectItem.description &&
                                    <div className="row">
                                       <p className="descript"> {projectItem.description } </p>
                                    </div>
                                }
                            </>
                            }
                            <div className="row commentForm background_change">
                                <Grid col="10">
                                    <Card>
                                        <form onSubmit={handleSubmit} type="multipart/form-data">
                                            <h5 style={{textTransform:"capitalize"}}>
                                                <div className="iconName">{props.user && props.user.username.charAt(0)}</div>
                                               <p>{props.user && props.user.username}</p>
                                               </h5>
                                                <Editor
                                                    editorState={textarea}
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    toolbar={{
                                                        options:['inline', 'blockType', 'fontSize' , 'link', 'list', 'textAlign', 'history' ],
                                                        inline:{options:['bold', 'italic', 'underline']}
                                                    }}
                                                    onEditorStateChange={textarea => setTextarea(textarea)}
                                                />
                                                {/*<div className="fileComment"> {fileUpload && <div><i className="far fa-check-circle"></i></div>} {/*<input type="file"  onChange={(e)=> addFile(e.target)}      /></div>*/}
                                                <FileDrop
                                                    onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
                                                    onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
                                                    onFrameDrop={(event) => console.log('onFrameDrop', event)}
                                                    onDragOver={(event) => console.log('onDragOver', event)}
                                                    onDragLeave={(event) => console.log('onDragLeave', event)}
                                                    onDrop={(files, event) => addFile(files,'drag')}
                                                    >
                                                    <label>
                                                        {fileUpload && <div><i className="fa fa-spinner fa-pulse"></i></div>}
                                                        Drop some files here!
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
                                                <div className="button-area sendButton">
                                                    {allowSubmit ?
                                                        textarea ? <Button type="primary" field="submit" title="Send" icon="" color="" />  : <button className="button secondary" style={{width:"100%"}}>Send</button>
                                                    : <button className="button secondary" style={{width:"100%"}}>Send</button>}
                                                </div>
                                        </form>
                                    </Card>
                                </Grid>
                            </div>
                            <div className="row background_change">
                                <Grid col="10">

                                    <App />
                                </Grid>
                            </div>

                        </Card>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Details;
