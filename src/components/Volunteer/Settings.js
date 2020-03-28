
import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import {Spinner} from '../Common/Helper';
import {withRouter,Route,Switch,NavLink} from 'react-router-dom';
import { connect } from 'react-redux'; 
import EditUser from './../Modals/EditUser.js';
import { metaMessage,updateUser } from '../../redux/actions'; 
import $ from 'jquery';

const NotUpdated = ()=> (<span className="w3-small w3-text-grey">
    Not Updated</span>
)
class Settings extends Component{
    
    constructor(arg){
        super(arg);
        this.state = {
            data:{},
            modal:null
        }
    } 
    hideModal(){
        this.setState({modal:null});
    }
    showModal(){
        this.setState({
            modal:<EditUser  user={this.props.authUser} 
            metaMessage={this.props.metaMessage} 
            Days={this.props.Days}
            Availability={this.props.Availability}
            LocalBodies={this.props.LocalBodies}
            updateUser={this.props.updateUser}
            hideModal={this.hideModal.bind(this)}/>
        })
    }
    changePassword(e){
        e.preventDefault();
        e.stopPropagation();
        axios.post('/api/v1/auth/change-password',$(e.target).serialize()).then(resp=>{
            resp =resp.data;
            this.props.metaMessage(resp.meta);
        })
    }
    render (){
        const {authUser,leader,days} = this.props;
      
        return <div className="w3-row-padding"> 
            <div className="w3-col l12">
                <h3>Settings</h3> 
            </div>
            {this.state.modal}
            <div className="w3-col l7 w3-margin-bottom">
                    <table className="w3-table w3-table-all">
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{authUser.name}</td>
                            </tr>
                            
                            <tr>
                                <td>Phone Number</td>
                                <td>{authUser.phoneNumber}</td>
                            </tr>

                            <tr>
                                <td>District</td>
                                <td>{authUser.district || <NotUpdated/>}</td>
                            </tr>

                            <tr>
                                <td>Primary Role</td>
                                <td>{authUser.role}</td>
                            </tr>
                            <tr>
                                <td>Days Available</td>
                                <td><div style={{whiteSpace:"pre-wrap"}}>{authUser.json && authUser.json.dayPreference && authUser.json.dayPreference.map(item => item.label).join('\n') || <NotUpdated />}
                                </div></td>
                            </tr>
                            <tr>
                                <td>Availability Status</td>
                                <td>{authUser.availabilityStatus}</td>
                            </tr>
                            <tr>
                                <td>Mobile Status</td>
                                <td>{authUser.status}</td>
                            </tr>
                            <tr>
                                <td>About Yourselves</td>
                                <td style={{whiteSpace:"pre-wrap"}}>{authUser.about|| <NotUpdated/>}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td style={{whiteSpace:"pre-wrap"}}>{authUser.address || <NotUpdated/>}</td>
                            </tr>
                            
                            {
                                authUser.leader && <tr>
                                <td>Reports To </td>
                                <td>{authUser.leader.name}, {authUser.leader.phoneNumber}</td>
                            </tr>
                            }
                            
                            <tr>
                                <td>Location Preference</td>
                                <td>{authUser.userRoles.map( item => {
                                        return <div key={item.localBody.name}>{`${item.role} - ${item.localBody.name} `}</div>
                                    })
                                }</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="w3-right-align w3-section">
                        <button onClick={this.showModal.bind(this)} className="w3-button w3-blue w3-round w3-padding-small">Edit Information</button>
                    </div>
           </div> 
           <form onSubmit={this.changePassword.bind(this)} className="w3-col l5 "
                method="POST" action="/api/v1/auth/change-password">
               <div className="w3-border w3-row w3-padding">
            <div className="w3-col l12">
                <b className="w3-block w3-center">Change Password</b> 
            </div>
            <div className="w3-col l12">
                <label>Current Password</label>
                <input name="currentPassword" type="password" className="w3-input w3-border" />
            </div>
            <div className="w3-col l12">
                <label>Password</label>
                <input name="password" type="password" className="w3-input w3-border" />
            </div>  
            <div className="w3-col l12">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" className="w3-input w3-border" />
            </div>   
            <div className="w3-col l12 w3-margin-top">
                <button className="w3-green w3-button w3-right w3-round w3-padding-small ">Change Password</button>
            </div>  
            </div>
           </form>
        </div>
    }
}

const mapStateToProps = (state) =>{
    return {
        authUser:state.authUser,
        leader:state.leader, 
        LocalBodies:state.LocalBodies,
        Days:state.Days,
        Availability:state.Availability
    }
}

export default connect(mapStateToProps, { 
    metaMessage, 
    updateUser
})(withRouter(Settings));
