
import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import  Reveal from '../Common/Reveal'; 
import $ from 'jquery';
import { metaMessage } from './../../redux/actions.js';

export default class AddRequest extends Component {

    constructor(arg){
        super(arg);
        this.state = {
            messageLength:0
        }
    }
    submitUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const data = $(e.target).serialize();

        if (this.props.request){
            axios.post("/api/v1/task/edit",data).then(resp=>{
                resp = resp.data;  
                this.props.metaMessage(resp.meta);
                if (resp.meta.success){
                    this.props.hideModal('reload',resp.data);   
                }
            });
        } else {

            axios.post("/api/v1/task/create",data).then(resp=>{
                resp = resp.data;  
                this.props.metaMessage(resp.meta);
                if (resp.meta.success){
                    this.props.hideModal('reload',resp.data);   
                }
            });
        }
    }

    handleMessageChange(e){
        this.setState({
            messageLength:e.target.value.length
        })
    }
    setMessage(e){
        const {message,range_start,range_end,ward} = this.refs;
        if (message.value == ''){
            const w = this.props.authUser.userRoles.find(role => role.localBody.code == ward.value );
            $(message)
            .val(`Complete damage assessment of house no ${range_start.value} to ${range_end.value} on ${w.localBody.name}`);
        }
    }

    render() {
        const {user,hideModal,request,authUser} = this.props;
        return <Reveal modalClass="small-form" onClose={e => hideModal() }>
        <form className="w3-row w3-padding " id="update_form" method="POST" action="/api/v1/task/create"
            onSubmit={this.submitUpdate.bind(this)}>
        <div className="w3-row-padding w3-margin-bottom">
            <input type="hidden" name="assignee" value={request ? request.id : user.id} />
            <input type="hidden" name="requestId" value={request ? request.id : ''} />
            <div className="w3-col l12 w3-margin-bottom"> 
                <label>Message (max 600 characters)</label>
                <textarea ref="message" onChange={this.handleMessageChange.bind(this)} 
                    required name="comment" placeholder="Complete Survey of house number 1 to 100" 
                    className="w3-input w3-border"></textarea>
                <span className="w3-right w3-text-grey">{600 - this.state.messageLength}</span>
            </div> 

            {!request && <div className="w3-col l6 w3-section">
                <label>Ward</label>
                <select name="ward" ref="ward" className="w3-input w3-select w3-border" >
                    {this.props.authUser.userRoles.map(item =>{
                       return <option value={item.localBody.code}>{item.localBody.name}</option>
                    })}
                </select>
            </div> 
            }
            <div className="w3-col s6 l3">
                <label>Start #</label>
                <input name="range_start" ref="range_start" defaultValue={request ? request.itemRange[0]:0} placeholder="1" className="w3-input w3-border" type="number"/>
            </div> 

            <div className="w3-col s6 l3">
                <label>End # </label>
                <input name="range_end" ref="range_end" onBlur={this.setMessage.bind(this)} defaultValue={request ? request.itemRange[1]:0}  placeholder="100" className="w3-input w3-border" type="number"/>
            </div> 
            {
                request && <div className="w3-col l6 w3-section">
                <label>Status</label>
                <select name="status"  defaultValue={request.status} className="w3-input w3-select w3-border" >
                    <option value="PROGRESS">Progress</option>
                    <option value="COMPLETED">Completed</option> 
                    <option value="CLOSED_VERIFIED">Closed after Verifying Surveys</option>
                    <option value="CLOSED_PARTIAL">Closed - Partially Completed</option>
                    <option value="CLOSED_NOT_RESPONDING">Closed - Volunteer Not Responding</option>
                </select>
            </div> 
            }
        </div>
            <button className="w3-button w3-round w3-padding-small w3-blue w3-right">Submit</button>
        </form>
       </Reveal>
    }
}
  