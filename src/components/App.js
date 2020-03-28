import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom'
import VolunteerLanding from './Volunteer/Landing';
import ActionRedirect from './Common/ActionRedirect';
import RequestManager from './Requests';
import {connect} from 'react-redux';
import { loadConfig, getAuthUser } from './../redux/actions.js';

class App extends React.Component {
    componentDidMount() {
        this.props.getAuthUser();
        this.props.loadConfig();
    }
    render() {
        return <Switch>
            <Route path="/requests/:param?" component={RequestManager} />
            <Route path="/logout">
                <ActionRedirect action={() => localStorage.removeItem('accessToken')} href="/" />
            </Route>
            <Route path="/:param1?/:param2?/:param3?/:param4?/:param5?"
                component={VolunteerLanding}
            />
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