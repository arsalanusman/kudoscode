import React, {useState, useEffect} from 'react';
import {encode} from "base-64";
import Table from '../theme/components/Table'
import Card from '../theme/components/Card'
import Grid from '../theme/components/Grid'
import API from '@aws-amplify/api';
import {Link} from "react-router-dom";
import { Fetcher } from './Global';
import Moment from 'react-moment';
import useSWR, { mutate, trigger } from "swr";
import { syncWithStorage } from 'swr-sync-storage';


const Dashboard = (props) => {


    const [support, setSupport] = useState([])
    const [project, setProject] = useState([])
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCompany, setIsCompany] = useState(false)
    const [supportError, setSupportError] = useState('<i class="fa fa-spinner fa-pulse"></i>')
    const [projectError, setProjectError] = useState('<i class="fa fa-spinner fa-pulse"></i>')
    var findUpcoming = []
    var findNearestDate = []


    const { data:general,error:generalError } = useSWR("/general/")
    const { data:company,error:companyError } = useSWR("/company/")
    const { data:cr_project,error:cr_projectError } = useSWR("/cr_project/")



    function CompanyIcon(props){
        const { data,error } = useSWR("/projects/"+props.id, Fetcher)
        console.log(data,'data')
        if(data && data['project']){
            return <img src={data['project'].logo} className="attachment-medium size-medium" alt=""/>
        }else{
            return  <div><i aria-hidden="true" className="far fa-building"></i></div>
        }
    }
    function CompanyDescription(props) {
        const { data,error } = useSWR("/projects/"+props.id)
        if(data && data['project']){
            return data['project'].description
        }else{
            return   <div><i className="fa fa-spinner fa-pulse"></i></div>
        }
    }
    function Tasklist(props) {
        const { data:tasklist, error } = useSWR("/tasklists/"+props.id, Fetcher)
        let taskLink = props.id+'/tasks.json?tag-ids=79803'
        const { data:tasks, error:taskError } = useSWR("/tasklists/"+taskLink, Fetcher)
        if(tasklist){
            if(tasks && tasks['todo-items']){
                let skd = tasks['todo-items'].filter(items => items['todo-list-id'] == tasklist['todo-list'].id)
                return  <tr><td><Link to={'/support/' + props.support_id + '/projects/' + tasklist['todo-list'].id}>{tasklist['todo-list'].name}</Link></td><td></td> <td><a href="#">{skd.length == 0 ? 'No':skd.length} Task</a></td><td>{tasklist['todo-list'].lastUpdated ? <Moment fromNow>{tasklist['todo-list'].lastUpdated}</Moment> : '' } </td> </tr>
            }else{
                return   <div><i className="fa fa-spinner fa-pulse"></i></div>
           }
        }
        return   <div><i className="fa fa-spinner fa-pulse"></i></div>
    }

    function Milestone(props){
        let id = props.id + "/milestones.json"
        let project_id = props.id + ".json"
        const { data:milestone, error:milestoneError } = useSWR("/projects/" + id, Fetcher)
        const { data:project, error:projectError } = useSWR("/projects/" + project_id, Fetcher)

        if(milestone && project){
            let data = {projects:project['project'], milestones:milestone['milestones'] && milestone['milestones'].filter((ml)=> ml.status == 'upcoming'), deadlines:milestone['milestones'] && milestone['milestones'].filter((ml)=> ml.status == 'upcoming' ).map((item)=> parseInt(item.deadline))}
            let indx = props.index
            let col =  data['milestones'] && data['milestones'].filter((ml,index)=> Math.min.apply(null, data.deadlines) == ml.deadline &&  <div className='mlStone'> {ml.title} </div>)
            if(col  ){
                if(col[0]){
                    return col[0].title
                }
            }
            return 'No Stage'

        }
        return <div><i className="fa fa-spinner fa-pulse"></i></div>
    }

    function Status(props){
        let project_id = props.id + ".json"
        const { data:project, error:projectError } = useSWR("/projects/" + project_id)

        if(project && project.project){
            let col =  <p><i className="fa fa-circle" style={{color: project.project.boardData &&  project.project.boardData['column'] && project.project.boardData['column'].color && project.project.boardData['column'].color}}></i> {project.project.boardData && project.project.boardData['column'] && project.project.boardData['column'].name && project.project.boardData['column'].name}</p>
            console.log(col)
            return col
        }
        return <div><i className="fa fa-spinner fa-pulse"></i></div>
    }
    function cr_Project(data,link){
        mutate('/cr_project/', {cr_project:data})
       props.history.push(link)
    }

    useEffect(() => {
        let apiName = 'kudosAPI';
        let path = '/general';
        let options = {
              body: {
                id: localStorage.getItem('company_name') == "kodoscode" ? '5f8050f17596ca3240a8e8c4' : localStorage.getItem('company_name')
              }
        }
        API.post(apiName, path, options).then(response => {

            if(response.body._id){
                var path = '/general/sub_company';
                var options = {
                    body: {
                         parent_company_id: response.body._id
                    }
                }
                 API.post(apiName, path, options).then(sub => {
                    mutate('/general/', {company:response.body, subcompany:sub.body})
                })
            }


            fetch(props.auth.baseUrl + "/companies/" + response.body.tw_companyID + ".json", {
                method: 'Get',
                headers: new Headers({
                    'Authorization': 'Basic ' + encode(props.auth.username + ':' + props.auth.password),
                    'Content-Type': 'application/json'
                }),
            })
            .then(response => response.json())
            .then(data =>  { mutate('/company/', {company:data.company}) })

                setIsLoading(true)
                setIsCompany(false) 

            }).catch(error=> error && setIsCompany("Your company is not registered. Please try to register now!"));


    }, [])
    /**
     * @return {string}
     */
    return (
        <>
            <div className="container">
                {company  ?
                    <>
                        <div className="row">
                            <Grid col="7">
                                <h1><em>Dashboard</em></h1>
                            </Grid>
                            <Grid col="3" textAlign="right">
                                {company && company.company && company.company['logo-URL'] ?
                                    <img src={company && company.company && company.company['logo-URL']} className="attachment-medium size-medium" alt=""/> :
                                    <h2> {general && general.company && general.company.name} </h2>}
                            </Grid>
                        </div>
                        <div className="row">
                            <Grid col="10">
                                <Card>
                                    <div className="row">
                                        <Grid col="10" textAlign="right"><a href="">Add New Client</a></Grid>
                                    </div>
                                    <br/>
                                    {general && general.subcompany.length ? general.subcompany.map((items, index) =>
                                        <div key={index}>
                                            <div className="row">
                                                <Grid col="3" textAlign="center">
                                                    <div className="company_icon">
                                                        <CompanyIcon id={items.supportbin.tw_projectID+'.json'} index={index} />
                                                    </div>
                                                    <h3>{items.name}</h3>
                                                    <p>
                                                        <CompanyDescription id={items.supportbin.tw_projectID+'.json'} index={index} />
                                                    </p>
                                                    <a href="#">Start New Project</a>
                                                </Grid>
                                                <Grid col="7">
                                                    {items.projects.length > 0 &&
                                                    <table className="tablesorter eael-data-table center">
                                                        <thead>
                                                        <tr className="table-header">
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text"><i className="fas fa-folder data-header-icon"></i> Projects</span></th>
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text"></span></th>
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text">Stage</span></th>
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text">Status</span></th>
                                                        </tr>
                                                        </thead>
                                                        {items.projects.length > 0 ? <tbody> {
                                                                items.projects.map((pro, i) =>
                                                                    <tr key={i}>
                                                                        <td><a onClick={()=>cr_Project(pro,'/company/' + items.tw_companyID + '/projects/' + pro.tw_projectID)}>{pro.name}</a></td>
                                                                        <td>{pro.type}</td>
                                                                        <td> <Milestone id={pro.tw_projectID} index={i}  /> </td>
                                                                        <td> <Status id={pro.tw_projectID} index={i}  /> </td>
                                                                    </tr>
                                                                )} </tbody> :
                                                            <div dangerouslySetInnerHTML={{__html: projectError}}></div>
                                                        }

                                                    </table>
                                                    }
                                                    {items.supportbin && items.supportbin.tasklist.length > 0 &&
                                                    <table className="tablesorter eael-data-table center ">
                                                        <thead>
                                                        <tr className="table-header">
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text"><i className="fas fa-briefcase-medical data-header-icon"></i> Support</span></th>
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text"></span></th>
                                                            <th className="" id="" colSpan=""><span className="data-table-header-text">Open Items</span></th>
                                                            <th className="" id ="" colSpan=""><span className="data-table-header-text">Last Update</span></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.supportbin.tasklist.map((tasklt,i)=> <Tasklist id={tasklt.tw_tasklistID+'.json'} support_id={items.supportbin.tw_projectID}/>)}
                                                         </tbody>
                                                    </table>
                                                    }
                                                </Grid>
                                            </div>
                                            {items.length != index + 1 &&
                                            <div className="row">
                                                <Grid col="10">
                                                    <hr className="plus"/>
                                                </Grid>
                                            </div>
                                            }
                                        </div>
                                    ) : <div><i className="fa fa-spinner fa-pulse"></i></div>}
                                </Card>
                            </Grid>
                        </div>
                        </>
                    :

                    <div className="row">
                        <Grid col="10">
                            <Card>
                                <div style={{textAlign:'center'}}> 
                                    {!isCompany ?
                                        <div><i className="fa fa-spinner fa-pulse"></i></div>
                                        : isCompany
                                    }
                                </div>
                            </Card>
                        </Grid>
                    </div>

            } 
            </div>

        </>
    );
}

syncWithStorage('local');
export default Dashboard;
