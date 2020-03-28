import  React,{ Component } from 'react'; 
import AddVolunteer from './Register'; 
import { connect } from 'react-redux'; 
import { metaMessage } from '../../redux/actions';    
import VolunteerTaskList from './VolunteerTaskList';
import Settings from './Settings';
import {withRouter,Route,Switch,NavLink} from 'react-router-dom';
 
class DashboardVolunteer extends Component {
    render(){
        const {authUser} = this.props; 
        return <Switch>
            <Route exact path="/settings" component={Settings}/> 
            <Route path="/" render={params => {
               return <div >
                   <div className="w3-padding ">
                   <h4>Tasks </h4></div>
                   <VolunteerTaskList {...params} url={`/api/v1/task/assigned`}  user={authUser} />
               </div>
            } }/>
        </Switch>
    }
}

function mapStateToProps(state){
    return {
        authUser:state.authUser
    }
}
export default withRouter(connect(mapStateToProps, { 
    metaMessage
})(DashboardVolunteer));