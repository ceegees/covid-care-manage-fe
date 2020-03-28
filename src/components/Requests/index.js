import React ,{useEffect, useState} from 'react';
import { connect } from 'react-redux';
import AppLayout from '../Common/AppLayout';
import { withRouter, NavLink, Link } from 'react-router-dom';
import axios from 'axios';

function RequestManager ({authUser}) {

    const [requestList,setRequestList] = useState([]);

    const loadData = () => {
        axios.get('/apiv1/pass/list?status=pending').then(res=> {
            setRequestList(res.data.data);
        })
    }
    useEffect(loadData,[1])
    const actOnRequest = (refId,status) => {
        axios.post('/apiv1/pass/act',{
            refId,
            status,
        }).then(loadData);
    }
    return <AppLayout authUser={authUser}> 
        <div className="w3-padding"> 
        {requestList.map(item => (<div className="w3-row w3-padding w3-border-bottom ">
            <div className="w3-col m6">
             <div> Request Id : {item.refId}</div>
             Name : <b>{item.personName}</b> <br/>
             Phone Number : <b>{item.phoneNumber}</b> <br/>
             Reason : {item.json.reason} <br/>
             Govt Id Type : {item.json.govtIdType} <br/>
             Govt Id : {item.json.govtId} <br/>
             District : {item.json.district} <br/>
             State : {item.json.state} <br/>
             {/* Govt Id : {item.json.govtId} <br/> */}
             
             </div>
             <div className="w3-col m5"> 
                <b>Routes</b><br/>
                 From : {item.json.dateFrom} <br/>
                 To : {item.json.dateTo} <br/>
                 <ul>
                     {item.json.routes && item.json.routes.map(row => (<li>
                         {row.locationFrom} to {row.locationTo}
                     </li>))}
                 </ul>
             </div>
             <div className="w3-col m1">
                 <button className="w3-button w3-green w3-round  w3-padding-small w3-margin"
                 onClick={()=> actOnRequest(item.refId,'APPROVED')}
                 >Accept</button>
                 <button className="w3-button w3-red w3-round w3-padding-small w3-margin"
                 onClick={()=> actOnRequest(item.refId,'REJECTED')}
                 >Reject</button>
            </div>
             </div>
        ))}
        </div>
    </AppLayout>
}


function mapStateToProps(state) {
    return {
        authUser: state.authUser,
        localBodies: state.LocalBodies
    }
}

export default connect(mapStateToProps)(withRouter(RequestManager));
