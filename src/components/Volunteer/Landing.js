import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { metaMessage } from './../../redux/actions.js';
import Header from './../Common/Header';
import { Spinner } from '../Common/Helper';
import DashboardOfficer from '../Dashboard/DashboardOfficer';
import DashboardVolunteer from '../Dashboard/DashboardVolunteer';
import DashboardAdmin from '../Dashboard/DashboardAdmin';
import { loadConfig, getAuthUser } from './../../redux/actions.js';
import AppLayout from '../Common/AppLayout';
import AppMessage from '../Common/AppMessage.js';

class Landing extends Component {

    componentDidMount() {
        this.props.loadConfig();
    }
    render() {
        let content = null;
        const { authUser } = this.props;
        if (authUser === null) {
            return <div className="w3-padding-64 w3-center">
                <Spinner />
            </div>
        } else if (!authUser) {
            return <div className="w3-animate-opacity">
                <AppMessage />
                <Header />
            </div>
        } else if (authUser.role == 'OFFICER') {
            return <AppLayout >
                <DashboardOfficer />
            </AppLayout>
        } else if (authUser.role == 'ADMIN' || authUser.role == 'MANAGER') {
            content = <AppLayout >
                <DashboardAdmin  {...this.props} />
            </AppLayout>
        }
        return <AppLayout >
            <DashboardVolunteer />
        </AppLayout>
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