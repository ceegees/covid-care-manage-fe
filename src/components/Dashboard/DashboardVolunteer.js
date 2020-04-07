import  React,{ Component } from 'react'; 
import AddVolunteer from '../Volunteer/Register'; 
import { connect } from 'react-redux'; 
import { metaMessage } from '../../redux/actions';    
import VolunteerTaskList from '../Volunteer/VolunteerTaskList';
import Settings from '../Volunteer/Settings';
import {withRouter,Route,Switch,NavLink} from 'react-router-dom';
 
class DashboardVolunteer extends Component {
    render(){
        const {authUser} = this.props; 
        return <div >
            <div className="w3-padding ">
            <h4>Tasks </h4></div>
            <VolunteerTaskList  url={`/api/v1/task/assigned`}  user={authUser} />
        </div>
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