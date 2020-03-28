import React, { Component } from 'react';
import Register from './Register';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';
import { metaMessage } from './../../redux/actions.js';
import AppMessage from './../Common/AppMessage.js';
import Header from './../Common/Header';
import { Spinner } from '../Common/Helper';
import DashboardOfficer from './DashboardOfficer';
import DashboardVolunteer from './DashboardVolunteer';
import DashboardAdmin from './DashboardAdmin';
import { loadConfig, getAuthUser } from './../../redux/actions.js';
import AppLayout from '../Common/AppLayout';

class Landing extends Component {

    componentDidMount() {
        this.props.loadConfig();
    }
    render() {
        let content = null;
        const { authUser } = this.props;
        if (authUser === null) {
            content = <div className="w3-padding-64 w3-center">
                <Spinner />
            </div>
        } else if (!authUser) {
            content = <div className="w3-animate-opacity">
                <Header />
                {/* <Register /> */}
            </div>
        } else if (authUser.role == 'OFFICER') {
            content = <AppLayout authUser={authUser}>
                <DashboardOfficer />
            </AppLayout>
        } else if (authUser.role == 'ADMIN' || authUser.role == 'MANAGER') {
            content = <AppLayout authUser={authUser}>
                <DashboardAdmin  {...this.props} />
            </AppLayout>
        } else {
            content = <AppLayout authUser={authUser}>
                <DashboardVolunteer />
            </AppLayout>
        }
        return <div >
            <AppMessage />
            <div style={{ marginBottom: "20px", minHeight: "98vh" }}>
                {content}
            </div>
            <div className="footer w3-padding">
                <footer className="w3-center ">
                    <div className="container  w3-right-align w3-small">
                        <a className="w3-margin-left w3-margin-right " target="_blank" href="https://goo.gl/forms/zPGlUqo8CbwgXpYG2">Feedback</a>|
                        <a className="w3-margin-left w3-margin-right" href="/disclaimer/" >Disclaimer</a>|
                        <a className="w3-margin-left w3-margin-right" target="_blank" href="https://github.com/IEEEKeralaSection/rescuekerala/" >Github</a><br />
                    </div>
                </footer>
            </div>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.authUser,
        localBodies: state.LocalBodies
    }
}

export default connect(mapStateToProps, {
    metaMessage,
    loadConfig,
    getAuthUser
})(withRouter(Landing));