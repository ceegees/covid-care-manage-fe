import  React,{ Component } from 'react';  
import { connect } from 'react-redux'; 
import { metaMessage } from '../../redux/actions.js';      
import axios from 'axios'; 
import AddRequest from '../Modals/AddRequest.js'; 
import VolunteerTaskList from '../Volunteer/VolunteerTaskList.js';

import {withRouter,Route,Switch,NavLink} from 'react-router-dom'; 

class TaskManagerList extends Component {

    constructor(arg){
        super(arg);
        this.state = {
            list:[],
            showMap:{},
            modal:null
        }
    }

    toggleUserTaskView(user){
        this.setState({showMap:
            Object.assign(this.state.showMap,{
                [user.id]: !this.state.showMap[user.id] 
            })
        });
    }

    loadData(){
        axios.get('/api/v1/volunteer/list').then(resp=>{
            resp =resp.data
            if (resp.meta.success) {
                this.setState({
                    list:resp.data
                });
            } else {
                this.props.metaMessage(resp.meta);
            }
        });
    }

    componentDidMount(){
       this.loadData();
    }

    hideModal(message){
        this.setState({modal:null});
        if(message == 'reload'){
            this.loadData();
        }
    }

    addTask(user){
        this.setState({modal:<AddRequest 
            user={user} 
            hideModal={this.hideModal.bind(this)} 
            metaMessage={this.props.metaMessage}
            {...this.props} />})
    }

    render(){
        return <div>
            <div className="w3-padding">
                <h4>Volunteer List</h4>
            </div>
            {this.state.modal}
            <div className="w3-responsive"> 
            <table className="w3-table w3-table-all">
                <thead>
                    <tr>
                        <th>Sl No</th>
                        <th>Information</th> 
                    </tr>
                </thead>
                <tbody> 
                   {this.state.list.length == 0 && <tr><td colSpan="4">Voluteers are not registered for your local body, Please wait for Volunteers to Join. <br/>
                   താങ്കളുടെ പ്രദേശത്തു സേവനം നൽകുന്നതിനായി സന്നദ്ധപ്രവര്ത്തകർ ചേർന്നുകൊണ്ടിരിക്കുകയാണ്, ദയവായി കാത്തിരിക്കൂ .</td></tr>}
                   { this.state.list.map((user,idx) => {
                       return <React.Fragment key={`item_${idx}`}> 
                           <tr key={idx}>
                               
                                <td>{idx+1}</td>
                                <td>
                                    <div className="w3-display-container">{user.name}<br/>
                                {user.phoneNumber|| user.phone_number} <br/> 
                                    <button  
                                    className="w3-button w3-display-bottomright w3-round w3-padding-small w3-blue w3-tiny" 
                                    onClick={this.toggleUserTaskView.bind(this,user)}>
                                    {this.state.showMap[user.id]?'Hide':'Show'} Tasks</button>
                                    </div>
                                </td>  
                            </tr>
                            {this.state.showMap[user.id] &&
                            <tr key={`info`+idx}>
                                <td colSpan="2" style={{padding:"6px 2px"}}>
                                    <div className="w3-left-align w3-padding-small">
                                    <button className="w3-button w3-round w3-padding-small w3-indigo " 
                                    onClick={this.addTask.bind(this,user)}>Add Task</button>
                                    </div>
                                    <VolunteerTaskList user={user} url={`/api/v1/task/assigned?userId=${user.id}`} />
                                </td>
                            </tr>}
                       </React.Fragment>
                    })}
                </tbody>
            </table>
            </div>
        </div>
    }
} 

class DashboardOfficer extends Component {
    render(){
        const {authUser,metaMessage} = this.props; 
        return <Switch> 
            <Route exact path="/created" render={params => { 
                return  <div className="w3-padding-small">
                    <h3>Tasks you created</h3>
                    <VolunteerTaskList  url='/api/v1/task/created-by-me' />
                </div>
                }
            }/> 
            <Route path="/" render={params => {
               return <TaskManagerList {...params}  authUser={authUser} metaMessage={metaMessage} />
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
})(DashboardOfficer));