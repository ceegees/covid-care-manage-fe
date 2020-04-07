import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import VolunteerLanding from './Volunteer/Landing';
import ActionRedirect from './Common/ActionRedirect';
import AppLayout from './Common/AppLayout';
import RequestManager from './Requests';
import { connect } from 'react-redux';
import { loadConfig, getAuthUser } from './../redux/actions.js';
import DashboardAdmin from './Dashboard/DashboardAdmin';
import Settings from './Volunteer/Settings';
import LocalBodyBrowser from './Volunteer/LocalBodyBrowser';
import AppMessage from './Common/AppMessage';

class App extends React.Component {
    componentDidMount() {
        this.props.getAuthUser();
        this.props.loadConfig();
    }
    render() {
        const {authUser} = this.props;
        return <Switch>
            <Route path="/dashboard" >
                <AppLayout>
                    <DashboardAdmin />
                </AppLayout>
            </Route>
            <Route path="/rq/:type/:status?/:page?"  >
                <AppLayout>
                    <RequestManager />
                </AppLayout>
            </Route>
            <Route path="/settings">
                <AppLayout>
                    <Settings />
                </AppLayout>
            </Route>
            <Route path="/logout">
                <ActionRedirect action={() => localStorage.removeItem('accessToken')} href="/" />
            </Route>
            <Route path="/lb/:parentId?/:type?/:status?/:page?">
                <AppLayout><LocalBodyBrowser /></AppLayout>
            </Route>
            <Route path="*"> 
                <VolunteerLanding />
            </Route>
        </Switch>
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.authUser,
    }
}

export default withRouter(connect(mapStateToProps, {
    getAuthUser,
    loadConfig
})(App));