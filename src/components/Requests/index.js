import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import AppLayout from '../Common/AppLayout';
import { withRouter, NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import RequestCard from './Card';
import { metaMessage } from '../../redux/actions';
import Paginator from '../Common/Paginator';
import { Spinner } from '../Common/Helper';
const perPage = 10;
function RequestManager(props) {
    const { authUser,
        base = "/rq/travel_pass",
        match: {
            params: {
                type = 'travel_pass',
                parentId = "",
                status,
                page = 1
            }
        }
    } = props;

    const inputRef = useRef();
    const [requestList, setRequestList] = useState(null);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const loadData = (actionResp) => {
        setRequestList(null);
        if (actionResp) {
            props.metaMessage(actionResp.data.meta);
        }
        axios.get(`/apiv1/pass/list`, {
            params: {
                status,
                perPage,
                page,
                q: search,
                parentId,
                type
            }
        }).then(res => {
            setTotal(res.data.data.count);
            setRequestList(res.data.data.rows);
        });
    }
    useEffect(loadData, [status, page, type, search]);


    const onSearch = (evt) => {
        evt.preventDefault();
        setSearch(inputRef.current.value);
    }
    if (!status) {
        return <Redirect to={`${base}/pending/1`} />
    }
    return <div className="w3-padding " >
        <h4>Travel Pass Requests</h4>
        <div className="w3-padding-top w3-bar w3-border-blue w3-border-bottom" >
            <div className="w3-left">
                <NavLink to={`${base}/pending`} activeClassName="w3-blue" className="w3-button tab-headers  ">Pending</NavLink>
                <NavLink to={`${base}/approved`} activeClassName="w3-blue" className="w3-button tab-headers ">Approved</NavLink>
                <NavLink to={`${base}/rejected`} activeClassName="w3-blue" className="w3-button tab-headers ">Rejected</NavLink>
            </div>
            <form onSubmit={onSearch} className="w3-right w3-padding-small">
                {(requestList && total > perPage) && <span style={{top:"2px",position:"relative"}} className="w3-display-inline-block w3-small w3-padding">Showing {(page-1)*perPage+1} to {page*perPage} of {total}</span>}
                <button className="w3-button w3-right w3-round w3-blue w3-padding-small">Search</button>
                <input ref={inputRef} type="text" placeholder="name / reason / mobile" className="w3-margin-right w3-padding-small w3-right w3-border" />
            </form>
        </div>
        <div style={{ minHeight: '78vh' }}>
            {search != "" && <div className="w3-show-inline-block w3-padding-small w3-center">Searching : <b>{search}</b>
                <span onClick={() => setSearch('')} style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    position: 'relative',
                    top: '3px'
                }} className="w3-padding-small ion-ios-close-outline"></span></div>}
            {!requestList && <Spinner />}
            {requestList && requestList.length == 0 && <div className="w3-center w3-padding-64">There are no {status} requests </div>}
            {requestList && requestList.map(item => (<RequestCard item={item} loadData={loadData} />))}
        </div>
        <div className=''>
            <Paginator total={total}
                pageCount={15}
                perPage={perPage}
                page={page}
                base={`${base}/${status}`} />
        </div>
    </div>
}
function mapStateToProps(state) {
    return {
        authUser: state.authUser
    }
}

export default withRouter(connect(mapStateToProps, {
    metaMessage
})(RequestManager));
