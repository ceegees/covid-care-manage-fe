import  React,{ Component } from 'react'; 
import axios from 'axios';
import moment from 'moment';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux'; 
import { Spinner } from '../Common/Helper';   
import WorkLog from './../Modals/WorkLog';  
import AddWorkLog from './../Modals/AddWorkLog';
import AddRequest from './../Modals/AddRequest';
import { metaMessage , getBodyName} from './../../redux/actions.js';   
import RequestCard from '../Requests/Card';


class VolunteerTaskList extends Component {

    constructor(args){
        super(args);
        this.state = {
            taskList:null,
            modal:null
        }
    }

    loadData(actionResp){
        if(actionResp){
            this.props.metaMessage(actionResp.data.meta);
        } 
        axios.get(this.props.url).then(resp=>{
            resp = resp.data;
            if (!resp.meta.success){
                this.props.metaMessage(resp.meta);
                return;
            }
            this.setState({
                taskList:resp.data, 
            });
        });
    }

    componentDidMount(){
        this.loadData();
    }

    componentWillReceiveProps(nextProps){
        if (!this.props.user){
            return;
        }
        if (this.props.user.updatedAt != nextProps.user.updatedAt){
            this.loadData();
            return;
        }
    }
    componentDidUpdate(prevProps){
        if (prevProps.url != this.props.url){
            this.loadData();
        }
    }

    hideModal(message){ 
        this.setState({modal:null});
        if(message =='reload'){
            this.loadData();
        }
    }

    showWorkLog(item){
        this.setState({modal:<WorkLog 
            {...this.props}
            hideModal={this.hideModal.bind(this)} 
            id={item.id} 
        />  })
    } 

    updateData(task){
        this.setState({modal:<AddWorkLog  
            hideModal={this.hideModal.bind(this)} 
            request={task} 
            authUser={this.props.authUser}
            {...this.props} />});
    } 

    updateEdit(task) {
        this.setState({modal:<AddRequest 
            request={task}
            hideModal={this.hideModal.bind(this)} 
            authUser={this.props.authUser}
            metaMessage={this.props.metaMessage}
            {...this.props} />})
    }
    render(){

        let uiTaskList = null;
        let {taskList} = this.state;
        let uiMessage = null;
        let tblCls = '';
        const {authUser} = this.props;
        if (taskList == null){
            uiTaskList =  <Spinner/>
        } else if (taskList.length == 0 && this.props.user){
            tblCls = 'w3-hide';
            if (this.props.authUser.id == this.props.user.id){
                uiMessage =  <Redirect to="/dashboard"/>
            uiTaskList = null

            } else {
                uiTaskList =  <div className="w3-padding">Volunteer is not assigned with any tasks.</div>
            }
        } else if (taskList.length == 0){
            uiTaskList = <div className="w3-padding">The task list is empty</div>
        } else {
            uiTaskList = taskList.map(item =>{

                if (item.type == 'travel_pass') {
                    return <RequestCard item={item} loadData={this.loadData.bind(this)} />
                }
                let information = item.information;
                 
                let color = 'w3-amber';
                let border = '';
                if(item.operatorStatus == 'CLOSED_NOT_RESPONDING'){
                    color = 'w3-deep-orange';
                    border = 'w3-border-deep-orange';
                } else if (item.status == 'CLOSED'){
                    color = 'w3-green';
                    border = 'w3-border-green';
                } else if (item.status == 'COMPLETE'){
                    color = 'w3-teal'
                    border = 'w3-border-green';
                }
                return <div className={`w3-leftbar w3-white ${border} w3-row w3-display-container `} 
                    key={item.id} >
                    <div className="w3-border-top w3-border-bottom w3-col l12 s12 w3-padding-small"><b className="w3-small">#{item.id} - {getBodyName(item.locationCode).name},  Ward : {item.group.split("-").pop()}, 
                        House No : {item.itemRange.join(" to ")}</b>
                        <div className={`w3-tag w3-small w3-right ${color}`}>Status:<span className="kf-capitalize"> {item.operatorStatus.toLowerCase()}</span></div>
                     </div>
                    <div className={`w3-col l9 s12 w3-padding-small`}>
                        <div>{information}</div>   
                        <span className="w3-small w3-text-grey "> By {item.creator.name} , {moment(item.createdAt).fromNow()}</span> 
                        <br/>
                        <a href="#" className="w3-block w3-section" onClick={this.showWorkLog.bind(this,item)}>View Worklog</a>
                    </div>
                    <div className="w3-col l3 s12 w3-small w3-padding-small">
                        Progress: {`${item.servicedSize}/${item.requestSize}`}<br/> 
                        {item.assignee &&  `Assigned to: ${item.assignee.name}` } <br/>
                        {item.assignee &&  `Phone: ${item.assignee.phoneNumber}` } 
                        <br/>
                    </div>
                <div className="w3-col l12 s12 w3-left-align w3-padding-small"  >
                    {item.status != 'CLOSED' && <button className="w3-button w3-round w3-teal w3-margin-right w3-padding-small " onClick={this.updateData.bind(this,item)}>Update</button>
                    }
                    { authUser.role == 'OFFICER' &&  <button className="w3-button  w3-round w3-deep-orange w3-padding-small" onClick={this.updateEdit.bind(this,item)}>Edit</button>}
                </div>
                </div>
            })
        }
        return<div className="w3-responsive"> 
            {uiMessage}
            <div className="w3-border w3-section">
            {uiTaskList} </div>
            {this.state.modal}
        </div>
    }
}

function mapStateToProps(state){
    return {
        authUser:state.authUser
    }
}

export default connect(mapStateToProps, { 
    metaMessage
})(VolunteerTaskList);