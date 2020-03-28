import  React,{ Component } from 'react'; 
import axios from 'axios';
import moment from 'moment'; 
import { Spinner, EmptyTRMessage } from '../Common/Helper';    
import { metaMessage } from './../../redux/actions.js';   

export default class VolunteerList extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            search:'',
            volunteers:null,
            pref:1
        };
    } 
 
    selectPreferenece(evt){
        this.state.pref = evt.target.value;
        this.loadVolunteers();
    }

    loadVolunteers(){
        axios.get(`/api/v1/manage/volunteer-list?lbid=${this.props.localBody.id}&pref=${this.state.pref}`).then(resp=>{
            if(resp.data.meta.success){
                this.setState({
                    volunteers:resp.data.data.volunteers
                });  
            }
        })
    }

    componentDidMount(){
        this.loadVolunteers();
    }

    componentWillUpdate(nextProps){
        if(this.props.version != nextProps.version){
            this.loadVolunteers();
        }
    }
    render(){
        const {volunteers} = this.state;
        let {search} = this.state;
        search = search.toLowerCase();

       return <div className="w3-responsive">

           <div className="w3-row w3-margin-bottom">
               <div className="w3-col s3 m2 w3-padding w3-right-align">
                <label >Search</label>
                </div>
                <div className="w3-col s9 m5">
                <input  onChange={e => this.setState({search:e.target.value})} className="w3-input  w3-border w3-round " placeholder="Name or Phone Number"></input>
                </div>
                <div className="w3-col s2 m1 w3-right-align w3-padding">
                    <label>Having</label>
                </div> 
               <div className="w3-col s9 m4 w3-padding">
                <select onChange={this.selectPreferenece.bind(this)} 
                    className="w3-border w3-input w3-select " >
                    <option value="1">LSGI as 1st Preference</option>
                    <option value="2">LSGI as 2nd Preference</option>
                    <option value="3">LSGI as 3rd Preference</option>
                    <option value="4">LSGI as 4th Preference</option>
                    <option value="5">LSGI as 5th Preference</option>
                </select>
                </div>
           </div>
            <table className="w3-margin-bottom w3-table  w3-table-all">
                <tbody>
                {volunteers == null && <EmptyTRMessage colSpan="1"><Spinner/></EmptyTRMessage>}
                {volunteers && volunteers.length == 0 && <EmptyTRMessage colSpan="1">Empty List</EmptyTRMessage>}
                {volunteers && volunteers.filter(i => {
                return i.name.toLowerCase().indexOf(search) >= 0 ||
                i.phoneNumber.toLowerCase().indexOf(search)  >= 0
                } ).map((item,idx) => <tr key={idx}>
                    <td>{idx+1}</td>
                    <td>{item.name} <br/>ph:{item.phoneNumber}
                        <div className="w3-text-grey w3-small">
                        {item.json && item.json.dayPreference && item.json.dayPreference.map(i=>i.label).join(',')}</div>
                    </td> 
                    <td>{item.leader ? `assigned to ${item.leader.name} - ${item.leader.phoneNumber}` :<span className="w3-small w3-text-grey">Not Assigned</span>}
                    <button className={`w3-button w3-right w3-blue w3-padding-small w3-small w3-round ${item.leader ? 'w3-dark-grey':''} `} 
                    onClick={this.props.assignToOfficer.bind(this,item)}>
                        {item.leader ?`Re Assign LO`: `Assign to officer`}
                        </button></td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    }
}