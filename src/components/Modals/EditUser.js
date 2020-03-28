
import React,{ Component } from 'react';  
import Reveal from '../Common/Reveal'; 
import Select from 'react-select'
import axios from 'axios';
import { getLocalBodyOptions ,getBodyName} from '../../redux/actions'; 

export default class EditUser extends Component {

    constructor(arg){
        super(arg);
        this.state = {
            form:{},
            errors:{},
            workPreference:[],
            dayPreference:[],
            district:null,
            localBodyList:[]
        };
    }

    submitUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const data = Object.assign(this.state.form,{
            name:this.refs.name.value,
            about:this.refs.about.value,
            address:this.refs.address.value,
            district:this.state.form.district.value,
            availability:this.state.form.availability.value,
        })
         
        axios.post('/api/v1/auth/update-user',data).then(resp=>{ 
            resp = resp.data;
            this.props.metaMessage(resp.meta);
            if (resp.meta.success){  
                this.props.updateUser(resp.data.user);
                this.props.hideModal('reload');
            }
        });
    }

    componentDidMount(){
        const {user, Availability,LocalBodies} = this.props; 
        const dist = LocalBodies.find(item => item.name == user.district); 
        let av =  Availability.find(i => i.value == user.availabilityStatus);
        if(!av){
            av = {label:'Available',value:'AVAILABLE'}
        }
        const nState = {
            form:{
                workPreference: user.userRoles.map(r => { return {
                    label:getBodyName(r.localBody.code).name,
                    value:r.localBody.code
                }}),
                availability:av,
                district:{
                    value:user.district,
                    label:user.district
                },
                dayPreference: user.json.dayPreference,
            },
            errors:{},
           
            localBodyList : dist ? getLocalBodyOptions(dist.bodies):[],
        };
        this.setState(nState) 
    }

    updateForm(obj){
        this.setState(Object.assign(this.state.form,obj));
    }

    districtChange(option){
        const dist = this.props.LocalBodies.find(item => option.value == item.name);
        if (dist){
            this.updateForm({
                workPreference:[],
                district:option, 
            });
            this.setState({ 
                localBodyList:getLocalBodyOptions(dist.bodies)
            })
        } else {
            this.updateForm({
                workPreference:[],
                district:option, 
            });
            this.setState({
                localBodyList:[]
            });
        }
    }

    availabilityChange(option){ 
        this.updateForm({
            availability:option
        })
    }

    workfPrefChange(option){ 
        this.updateForm({
            workPreference:option
        });
    }

    dayPrefChagne(option){
        this.updateForm({
            dayPreference:option
        })
    }
    render() {

        const {user,hideModal,Availability ,LocalBodies,Days} = this.props; 
        let bodyOptions  = [];
        if (this.state.workPreference.length < 5){
            bodyOptions = this.state.localBodyList;
        } 
        
        return <Reveal modalClass="small-form" onClose={e => hideModal() }>
        <form className="w3-row w3-section " method="POST" action="/api/v1/auth/update-user" onSubmit={this.submitUpdate.bind(this)}>
        <div className="w3-row-padding w3-margin-bottom">
            <div className="w3-col l12 s12"> 
                <label>Name</label>
                <input name="name" ref="name" className="w3-input w3-border" defaultValue={user.name} />
            </div>

            <div className="w3-col l6 s12 " > 
                <label>Availability Status</label> 
                <Select name="availability"  
                    options={Availability}
                    onChange={this.availabilityChange.bind(this)} 
                    value={this.state.form.availability}> 
                </Select> 
            </div>
            {user.role == 'VOLUNTEER' && !user.leader && <div className="w3-col l6"> 
                <label>District</label> 
                <Select name="district" 
                    onChange={this.districtChange.bind(this)} 
                    options={  LocalBodies.map(i => { 
                        return {label:i.name,value:i.name}})
                    } 
                    value={this.state.form.district}></Select>
            </div>  }
            {user.role == 'VOLUNTEER' && !user.leader && <div className="w3-col l12"> 
                <label>Location Preference</label> 
                <Select name="workPreferences" 
                    options={bodyOptions} 
                    onChange={this.workfPrefChange.bind(this)}
                    isMulti={1}
                    value={this.state.form.workPreference}></Select>
            </div> }

            <div className="w3-col l12"> 
                <label>Work Day Preference</label>
                <Select name="dayPreferences" options={Days} 
                    onChange={this.dayPrefChagne.bind(this)}
                    isMulti={true}
                    value={this.state.form.dayPreference}></Select>
            </div>

          
            <div className="w3-col l12"> 
                <label>About yourselves</label>  
                <textarea name="about" placeholder="I am a Doctor / Welder / Student / Construciton Worker" ref="about"  defaultValue={user.about}  className="w3-border w3-input"></textarea>
            </div>  
            <div className="w3-col l12"> 
                <label>Address</label>  
                <textarea ref="address" name="address" defaultValue={user.address}  className="w3-border w3-input"></textarea>
            </div>  
                
            <div className="w3-col l12 w3-right-align w3-margin-top"> 
                <button className="w3-button w3-blue w3-padding-small w3-round ">Submit</button>
            </div>
        </div>
        </form>
       </Reveal>
    }

}
 