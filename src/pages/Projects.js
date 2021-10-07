import React,{useState,useEffect} from 'react';
import { encode } from "base-64";
import Table from '../theme/components/Table'
import Card from '../theme/components/Card'
import Grid from '../theme/components/Grid'
import API from '@aws-amplify/api';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import useSWR, { mutate, trigger } from 'swr'
import { syncWithStorage } from 'swr-sync-storage';
import { Fetcher, GetInvoices, GetOnlineLink, NewTokenGenerate, Formatter, MomentFormat } from './Global'

const Projects = (props) => {


  
    const tw_company = JSON.parse(props.tw_company);
    const projectId = props.match.params.project_id;
    const companyId = props.match.params.company_id;
    const [currentProject,setCurrentProject] = useState()
    const [project,setProject] = useState([])
    const [milestones,setMilestones] = useState([])
    const [tasks,setTasks] = useState([])
    const [link,setLink] = useState([])
    const [token,setToken] = useState(localStorage.getItem('access_token'))
    const [tasksError,setTasksError] = useState()
    const [MilestonesError,setMilestonesError] = useState('<i class="fa fa-spinner fa-pulse"></i>')
    const [isModel,setModel] = useState({isOpen:false,data:null})
    const [inoviceIdList,setInoviceIdList] = useState([])
    const [invoicesLink,setInvoicesLink] = useState()


    const  { data: projectTasklist } =  useSWR("/projects/" + projectId + "/tasks.json?tag-ids=79803", Fetcher)
    const  { data: linkList } =  useSWR("/projects/" + projectId + "/links.json", Fetcher)
    const  { data: projectLists } =  useSWR("/projects/" + projectId + ".json", Fetcher)
    const  { data: milestoneLists, error: MilestoneError } =  useSWR("/projects/" + projectId + "/milestones.json", Fetcher)



    function InvoiceLink(props){
        let id = props.id + '/OnlineInvoice'
        const { data: link, error:errorLink } =  useSWR(props.id ? '/Invoices/'+id : null, GetOnlineLink)
        if(link){
            return <a href={link.OnlineInvoices && link.OnlineInvoices[0].OnlineInvoiceUrl} target="_blank">{props.name}</a>
        }else{
            return <div><i className="fa fa-spinner fa-pulse"></i> </div>
        }
    }


    function InvoicesCollect(props){
        let sucess = false
        setTasksError(false)

        const { data: invoicesList, error:errorInvoice } =  useSWR( props.id.length > 0 ? '/Invoices/?IDs='+ props.id.join(',') : null, GetInvoices)

        if(invoicesList){
            if(invoicesList.Status != 401){
                sucess = true
            }else{
                setTasksError(true)
            }
        }
        const { data: tokens, error: tokenError } =  useSWR(tasksError ? '/general/refreshTokenGet/': null, NewTokenGenerate)

        if(!props.id.length > 0){
            return <div style={{textAlign:"center"}}> Invoices are not available </div>
        }else{
            if(sucess){

                setTasksError(false)
                if(invoicesList.Status != 401){
                    return  invoicesList.Invoices.map((items)=> <tr><td> <InvoiceLink id={items.InvoiceID} name={items.InvoiceNumber} /> {items.Reference}</td><td><MomentFormat>{items.DueDateString}</MomentFormat></td> <td style={{textAlign:"right"}}>{Formatter(items.Total)}</td> <td style={{textAlign:"right"}}>{items.Status}</td></tr> )
                }else{
                    return <div><i className="fa fa-spinner fa-pulse"></i> </div>
                }
            }else{
                return <div><i className="fa fa-spinner fa-pulse"></i> </div>
            }
        }

    }


    const { data:general,error:generalError } = useSWR("/general/")
    const { data:main_company,error:companyError } = useSWR("/company/")
    const { data:cr_project,error:cr_projectError } = useSWR("/cr_project/")


    useEffect(()=>{
      
    },[])

    const redirectUrl = (e) => {
        if (typeof window !== 'undefined') {
            window.open(e,'_blank');
        }
    }

    const openModel = (e) => {
        // if (typeof window !== 'undefined') {
        //     window.open(e.code,'_blank');
        // }
        setModel({isOpen:true,data:e})
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
                    {main_company && main_company.company &&  main_company.company['logo-URL'] ?
                        <img src={ main_company.company['logo-URL']} className="attachment-medium size-medium" alt=""/> :
                    <h2> {general && general.company && general.company.name} </h2>}
                </Grid>
            </div>
            <div className="row">
                <Grid col="10">
                    <Card>
                        <div className="row">
                            <Grid col="8">
                                <h4><Link to={'/dashboard/'}>{general && general.company && general.company.name}</Link></h4>
                                <h2>{cr_project.cr_project && cr_project.cr_project.name}</h2>
                            </Grid>
                            <Grid col="2">
                                <h4>
                                    {cr_project.cr_project && cr_project.cr_project.type}
                                </h4>
                            </Grid>
                        </div>
                        <br />
                        <div className="row">
                            <Grid col="3" textAlign="center">
                                <div className="company_icon">
                                    {projectLists && projectLists.project && !projectLists.project.logo  ?  <div><i aria-hidden="true" className="far fa-building"></i></div> : <img src={projectLists && projectLists.project && projectLists.project.logo} className='comImage' width="100%" />}
                                </div>
                                <h3></h3>
                                <p>{projectLists && projectLists.project && projectLists.project.description}</p>
                                <div className='buttonArea'>
                                {linkList &&  linkList.project &&  linkList.project.links && linkList.project.links.map((lk,i)=>
                                    lk.tags[0].name == 'dash' &&
                                    lk.description ?
                                            <button className='button secondary' onClick={()=>openModel(lk)}>{lk.name}</button>
                                        : <button className='button secondary' onClick={()=>redirectUrl(lk.code)}>{lk.name}</button>
                                )}
                                </div>

                            </Grid>
                            <Grid col="7">
                                {projectTasklist && projectTasklist['todo-items'] && projectTasklist['todo-items'].length > 0 &&
                                <table className="tablesorter eael-data-table center">
                                    <thead>
                                    <tr className="table-header">
                                        <th width="60%" className="" id="" colSpan=""> <span className="data-table-header-text"><i class="fas fa-folder data-header-icon"></i> Open Tasks</span></th>
                                        <th className="" id="" colSpan=""> <span className="data-table-header-text">Due Date</span></th>
                                        <th className="" id="" colSpan=""  style={{textAlign:"right"}}>  <span className="data-table-header-text">Status</span></th>
                                    </tr>
                                    </thead>
                                    {projectTasklist && projectTasklist['todo-items'].length > 0 ?  <tbody>
                                    {projectTasklist['todo-items'].map((tk, index)=>
                                         //tk['responsible-party-id'] == '298053' &&


                                        <tr key={index}>
                                           <td><Link to={props.match.url+'/detail/'+tk.id}>{tk['content'] && tk['content']}</Link></td>
                                            <td>

                                                {tk['due-date'] ? <MomentFormat>
                                                    {tk['due-date'].slice(4, 6) +'/'+ tk['due-date'].slice(6, 8) +'/'+ tk['due-date'].slice(0, 4)}
                                                </MomentFormat> : 'Not Set'}
                                            </td>
                                            <td  className='status'  style={{textAlign:"right"}}> {tk['boardColumn'] && <> <i class="fa fa-circle" style={{color:tk['boardColumn'].color}}></i>  {tk['boardColumn'].name}</>}</td>
                                        </tr>
                                    )} </tbody> : <div> "Open tasks are not available" </div> }

                                </table>
                                }
                                {milestoneLists &&  milestoneLists.milestones &&
                                <table className="tablesorter eael-data-table center">
                                    <thead>
                                    <tr className="table-header">
                                        <th  width="50%" className="" id="" colSpan=""> <span className="data-table-header-text"><i class="far fa-calendar-alt data-header-icon"></i> Project Milestones</span></th>
                                        <th className="" id="" colSpan=""> <span className="data-table-header-text">Due Date</span></th>
                                        <th className="" id="" colSpan=""  style={{textAlign:"right"}}>  <span className="data-table-header-text">Status</span></th>
                                    </tr>
                                    </thead>
                                    {milestoneLists &&  milestoneLists.milestones && milestoneLists.milestones.length > 0  ?  <tbody>
                                    {milestoneLists.milestones.map((ms, index)=>
                                        <tr key={index}>
                                            <td width="60%">{index + 1}) {ms['title'] && ms['title']}</td>
                                            <td>

                                                {ms['deadline'] ? <MomentFormat>
                                                    {ms['deadline'].slice(4, 6) +'/'+ ms['deadline'].slice(6, 8) +'/'+ ms['deadline'].slice(0, 4)}
                                                </MomentFormat> : 'Not Set'}

                                                </td>
                                            <td  className='status'  style={{textAlign:"right"}}>
                                                { ms['status'] != 'Late' ? "" : <i class="fa fa-circle" style={{color:'#6bc550'}}></i> } { ms['status'] && ms['status'] } </td>
                                        </tr>
                                    )} </tbody> : <div> "Milestones are not available" </div> }

                                </table>
                                }
                                {cr_project.cr_project &&  cr_project.cr_project.invoiceId.length > 0 &&
                                    <table className="tablesorter eael-data-table center">
                                        <thead>
                                        <tr className="table-header">
                                            <th className="" id="" colSpan=""> <span className="data-table-header-text"><i class="fas fa-money-check data-header-icon"></i> Project Invoices</span></th>
                                            <th className="" id="" colSpan=""> <span className="data-table-header-text">Due Date</span></th>
                                            <th className="" id="" colSpan="" style={{textAlign:"right"}}>  <span className="data-table-header-text">Amount</span></th>
                                            <th className="" id="" colSpan="" style={{textAlign:"right"}}>  <span className="data-table-header-text">Status</span></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        
                                            <InvoicesCollect id={cr_project.cr_project.invoiceId} />
                                       
                                        </tbody>
                                    </table>
                                 }
                            </Grid>
                        </div>  
                    </Card>
                </Grid>
            </div>

        </div>

        {isModel.isOpen &&
        <div className='model' aria-modal={isModel.isOpen}>
            <div className='model_description'>
                <div className="close" onClick={()=>setModel({isOpen: false,data:null})}><i className='fas fa-times-circle'>  </i> </div>
                <h3>{isModel.data.name}</h3>
                <a href={isModel.data.name} target="_blank"> {isModel.data.code}</a>
                <br /><br />
                <p dangerouslySetInnerHTML={{__html: isModel.data.description}}></p>
            </div>
        </div>
        }
    </>
    );
}

syncWithStorage('local');
export default Projects;
