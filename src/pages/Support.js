import React,{useState,useEffect} from 'react';
import { encode } from "base-64";
import Table from '../theme/components/Table'
import Card from '../theme/components/Card'
import Grid from '../theme/components/Grid'
import API from '@aws-amplify/api';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import useSWR, { mutate, trigger } from 'swr'
import { Fetcher, MomentFormat, Formatter, TimeConvert } from './Global'

const Supports = (props) => {

    const projectId = props.match.params.project_id;
    const companyId = props.match.params.support_id;
    const [link,setLink] = useState([])
    const [isModel,setModel] = useState({isOpen:false,data:null})

    const  { data: projectTasklist } =  useSWR("/tasklists/" + projectId + "/tasks.json?tag-ids=79803", Fetcher)
    const  { data:tasklist } = useSWR("/tasklists/"+projectId + ".json")
    const  { data: linkList } =  useSWR("/projects/" + companyId + "/links.json", Fetcher)
    const  { data: ratesList } =  useSWR("/projects/" + companyId + "/rates.json", Fetcher)
    const  { data: projectLists } =  useSWR("/projects/" + companyId + ".json")

    let billingRates = ratesList && ratesList.rates && ratesList.rates.users['298053']

    const { data:general,error:generalError } = useSWR("/general/")
    const { data:main_company,error:companyError } = useSWR("/company/")


    const redirectUrl = (e) => {
        if (typeof window !== 'undefined') {
            window.open(e,'_blank');
        }
    }

    const openModel = (e) => {
        if (typeof window !== 'undefined') {
            window.open(e.code,'_blank');
        }
        setModel({isOpen:true,data:e})
    }

    /**
     * @return {string}
     */
    return (
        <>
        {
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
                        <Grid col="2">
                            <Grid col="10" textAlign="right"><Link to={props.match.url+'/add'}>Add Support Request</Link></Grid>
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
                                        <button className='button secondary' onClick={()=>openModel(lk)}>{lk.name}</button> : <button className='button secondary' onClick={()=>redirectUrl(lk.code)}>{lk.name}</button>
                        )}
                        </div>

                    </Grid>
                    <Grid col="7">
                                {projectTasklist && projectTasklist['todo-items']  &&  projectTasklist['todo-items'].length > 0 &&
                                    <table className="tablesorter eael-data-table center">
                                        <thead>
                                            <tr className="table-header">
                                                <th width="220" className="" id="" colSpan=""> <span className="data-table-header-text"><i class="fas fa-folder data-header-icon"></i> Open Tasks</span></th>
                                                <th className="" id="" colSpan=""> <span className="data-table-header-text">Due Date</span></th>
                                                <th className="" id="" colSpan=""> <span className="data-table-header-text">Hours</span></th>
                                                <th className="" id="" colSpan=""> <span className="data-table-header-text">Amount</span></th>
                                                <th className="" id="" colSpan=""  style={{textAlign:"right"}}>  <span className="data-table-header-text">Status</span></th>
                </tr>
            </thead>
                                    {projectTasklist && projectTasklist['todo-items'].length > 0 ?  <tbody>
                                    {projectTasklist['todo-items'].map((tk, index)=>
                                        //tk['responsible-party-id'] == '298053' &&


                                        <tr key={index}>
            <td><Link to={props.match.url+'/detail/'+tk.id}>{tk['content'] && tk['content']}</Link></td>
            <td>{tk['due-date'] ? <Moment format="dddd">
                                                    {tk['due-date'].slice(4, 6) +'/'+ tk['due-date'].slice(6, 8) +'/'+ tk['due-date'].slice(0, 4)}
            </Moment> : 'Not Set'}
        </td>
        <td>{tk['estimated-minutes'] && TimeConvert(tk['estimated-minutes'])}</td>
        <td>{billingRates && Formatter(Math.round(TimeConvert(tk['estimated-minutes']) * billingRates.rate))} </td>
        <td  className='status'  style={{textAlign:"right"}}> {tk['boardColumn'] && <> <i class="fa fa-circle" style={{color:tk['boardColumn'].color}}></i>  {tk['boardColumn'].name}</>}</td>
    </tr>
)} </tbody> : <div> "Open tasks are not available" </div> }

</table>
}


</Grid>
</div>
</Card>
    </Grid>
    </div>

</div>
}

{isModel.isOpen &&
<div className='model' aria-modal={isModel.isOpen}>
    <div className='model_description'>
        <div className="close" onClick={()=>setModel({isOpen: false,data:null})}><i className='fas fa-times-circle'>  </i> </div>
        <h3>{isModel.data.name}</h3>
        <a href={isModel.data.name}> {isModel.data.code}</a>
        <br /><br />
        <p dangerouslySetInnerHTML={{__html: isModel.data.description}}></p>
        </div>
        </div>
    }
    </>
);
}

export default Supports;
