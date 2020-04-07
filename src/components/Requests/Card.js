import React from 'react';
import axios from 'axios';
import moment from 'moment';
export default function RequestCard({ item, loadData }) {

    const actOnRequest = (refId, status) => {
        axios.post('/apiv1/pass/act', {
            refId,
            status,
        }).then(loadData);
    }

    return <div className="w3-row w3-padding w3-border-bottom ">
        <div className="w3-col m5">
            <div> Request Id : {item.refId}</div>
            Name : <b>{item.personName}</b> <br />
            Phone Number : <b>{item.phoneNumber}</b> <br />
            Reason : <b>{item.json.reason} </b><br />
            Govt Id Type : {item.json.govtIdType} <br />
            Govt Id : {item.json.govtId} <br />

            Location : {item.json.localBody.name} <br />
            District : {item.district} <br />
            State : {item.state} <br />
            Requested : <b> {moment(item.createdAt).fromNow()} </b><br />


            {/* Govt Id : {item.json.govtId} <br/> */}
        </div>
        <div className="w3-col m5">
            <b>Routes</b><br />
            From : {item.json.dateFrom} <br />
            To : {item.json.dateTo} <br />
            <ul>
                {item.json.routes && item.json.routes.map(row => (<li>
                    {row.locationFrom} to {row.locationTo}
                </li>))}
            </ul>

            {item.actor && <div className="w3-border w3-light-grey w3-padding-small w3-round">
                <span>By : <b>{item.actor.name}</b></span><br />
                <span> {moment(item.operatorUpdatedAt).fromNow()}</span>

            </div>
            }
        </div>
        <div className="w3-col m2">
            {item.status != 'PENDING' && <div className="w3-padding">
                <b><span className={`w3-label w3-padding-small w3-border w3-round ${item.status == 'APPROVED' ?
                    'w3-text-green w3-border-green' : 'w3-border-red w3-text-red'}`}>{item.status}</span></b>
            </div>}

            {item.status == 'PENDING' && <React.Fragment>
                <button className="w3-button w3-green w3-round  w3-padding-small w3-margin"
                    onClick={() => actOnRequest(item.refId, 'APPROVED')}
                >Approve</button>
                <button className="w3-button w3-red w3-round w3-padding-small w3-margin"
                    onClick={() => actOnRequest(item.refId, 'REJECTED')}
                >Reject</button>
            </React.Fragment>}
        </div>
        <div className="w3-col m12">
            {item.information && <React.Fragment>
                Information : <span>&quot; {item.information} &quot;</span>
            </React.Fragment>}
        </div>
    </div>
}
