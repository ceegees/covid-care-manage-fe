

import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import  Reveal from '../Common/Reveal'; 
import Select from 'react-select';
import $ from 'jquery';


export default class AssignToOfficer extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            selectedOfficer:null,
            officerId:null,
            list:[]
        }
    }
    
    componentDidMount(){
        axios.get(`/api/v1/manage/lb-officers?id=${this.props.id}`).then(resp => {
            this.setState({
                list:resp.data.data.map(item=>{
                    return {
                        value:item.id,
                        label:`${item.name} (ph : ${item.phoneNumber}) `
                    }
                })
            })
        });
    }
    setValue(item){
        this.setState({selectedOfficer:item});
    }
    releaseVolunteer(){
        // confirm('Do you really want to release volunteer');
        axios.post('/api/v1/manage/release-volunteer',{
            userId:this.props.user.id
        }).then(resp=>{
            this.props.metaMessage(resp.data.meta);
            if(resp.data.meta.success){
                this.props.hideModal('reload_volunteers');
            }
        }).catch(ex => {
            console.error(ex);
        })
    }
    submitData(e){
        e.preventDefault();
        e.stopPropagation();
        axios.post('/api/v1/manage/assign-to-officer',$(e.target).serialize()).then(resp=>{
            this.props.metaMessage(resp.data.meta);
            if(resp.data.meta.success){
                this.props.hideModal('reload_volunteers');
            }
        });
    }

    render(){
        const {selectedOfficer } = this.state;
        const {user} = this.props;
        return <Reveal onClose={this.props.hideModal} modalClass="small-form w3-padding-32">
            <table className="w3-table w3-table-all">
                    <tbody><tr>
                        <td>Volunteer</td>
                        <td>{user.name}</td>
                        </tr>
                        <tr>
                        <td>Phone</td>
                        <td>{user.phoneNumber}</td>
                        </tr>

                        <tr>
                        <td>Days Available</td>
                        <td>{user.json.dayPreference.map(item => item.label).join(", ")}</td>
                        </tr>
                    </tbody>
                </table>
            <form method="POST" 
                action='/api/v1/manage/assign-to-officer' 
                onSubmit={this.submitData.bind(this)}className="w3-padding w3-row w3-margin-top">
                
                <div className="w3-col l12 ">

                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="officerId" value={selectedOfficer ? selectedOfficer.value : 0 } />
                    <label>Select Liaison Officer</label>
                
                    <Select options={this.state.list} 
                    value={selectedOfficer}
                    onChange={this.setValue.bind(this)}/>
                   
                </div>
                <div className="w3-bar">
                    {user.leader && <button className="w3-button w3-round w3-margin-top w3-left w3-deep-orange w3-small w3-small-padding" type="button"
                      onClick={this.releaseVolunteer.bind(this)}>Release Volunteer</button>}
                    <button className="w3-button w3-round w3-margin-top w3-right w3-green w3-small w3-small-padding">Assign</button>
                        
                </div>
            </form>
        </Reveal>
    }
}
