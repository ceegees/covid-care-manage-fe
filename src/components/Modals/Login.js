import  React,{ Component } from 'react';  
import { metaMessage } from '../../redux/actions.js';
import { FormTextField,ErrorHelperText } from '../Common/Helper.js'
import Reveal from '../Common/Reveal.js'; 
import axios from 'axios';
import { connect } from 'react-redux';
import Select from 'react-select'

class Login extends Component{

    constructor(arg) {
        super(arg);

        this.options = [];
        if (this.props.localBodies) {
            this.options = this.props.localBodies.reduce((acc,dist)=>{
                acc.push({
                    value:dist.code,
                    district:dist.name,
                    label: dist.name
                });
                for(var code in dist.bodies){
                    let suffix = 'Panchayath'
                    if(code[0] == 'M'){
                        suffix = 'Muncipality';
                    } else if (code[0]== 'C'){
                        suffix = 'Corporation';
                    } 
                    acc.push({
                        value:code,
                        district:dist.name,
                        label:`${dist.bodies[code]} ${suffix}, ${dist.name}`
                     })
                } 
                return acc;
            },[]);
        } 
        this.state =   {
            place: null,
            setLocation: null,
            form: {},
            errors: {}, 
            showPreferenceSelection:false,
            showPasswordLink:true,
            successMessage: ''
        }
    }
       
    changeFormValue(name,value) {
        this.state.form[name] = value;
    }

    sendPassword(){        
        let formData = Object.assign({},this.state.form);
        let errors = {};
        if (!formData.phoneNumber) {
            errors['phoneNumber'] = "Phone Number is required"
        } 
        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }
        this.setState({showPasswordLink:false});
        setTimeout(()=>{
            this.setState({showPasswordLink:true});
        },30000 );

        axios.post('/api/v1/auth/send-password',{
            phoneNumber:this.state.form.phoneNumber
        }).then(resp => {
            resp = resp.data;
            this.props.metaMessage(resp.meta,1); 
            this.setState({showPreferenceSelection:resp.data.needPreference});
        }).catch(ex=> {
            console.error(ex);
        });
    }
    
    handleSubmit(e) {
        let formData = Object.assign({},this.state.form);
        e.preventDefault();
        e.stopPropagation(); 

        let errors = {};
        if (!formData.phoneNumber) {
            errors['phoneNumber'] = "Phone Number is required"
        }
        if (!formData.password) {
            errors['password'] = "Password is required"
        }
        if (this.state.showPreferenceSelection && (
             !formData.localBody || formData.localBody.length == 0) ){
            errors['localBody'] = "Local Body Selection is Mandatory";
        }
 
        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }

        formData['type'] = this.props.type;
        axios.post('/api/v1/auth/login',formData)
        .then(resp=> { 
            resp = resp.data;
            if (!resp.meta.success) {
                this.props.metaMessage(resp.meta);
            } else {
                localStorage.setItem('accessToken',resp.data);
                document.location.href = "/";
                
            }
        }).catch(ex=> {
            console.error(ex);
        });
        return false;
    }
    preferenceChange(vals){   
        this.setState({form:Object.assign(this.state.form, {
                localBody:vals
            })
        });
    
    }

    render () {  
        return (
            <Reveal modalClass='small-form' onClose={this.props.hideModal} >
               <div className="w3-container " >   
                    <form className="w3-row-padding"  method="post" action="/api/v1/auth/login" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="l12 s12 w3-col w3-padding w3-center">
                            <img style={{height:"80px"}} src="https://upload.wikimedia.org/wikipedia/commons/4/46/Kerala_Government_Emblem.png" />
                        </div>
                        <div className="l12 s12 w3-col">
                            <FormTextField 
                                label="Phone Number"
                                placeholder="Phone Number"
                                name="phoneNumber"
                                isMandatory="true"
                                inputClass="w3-input w3-border"
                                value = {this.state.form.phoneNumber}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.phoneNumber} /> 
                        </div>
                        {this.state.showPreferenceSelection && <div className="l12 s12 w3-col">
                            <label>Please select your local body</label>
                            <Select options={this.options}
                                onChange={this.preferenceChange.bind(this)}
                                value={this.state.form.localBody} /> 
                            <ErrorHelperText errors={this.state.errors.localBody} />
                        </div>}
                        <div className="l12 s12 w3-col">
                            <FormTextField
                             label="Password"
                                placeholder="Password"
                                name="password"
                                isMandatory="true"
                                type="password"
                                value = {this.state.form.password}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.password} />
                        </div> 
                        <div className="w3-panel m12 s12 w3-col">
                            <div className="w3-left">
                                {this.state.showPasswordLink && 
                                <a href="#" onClick={this.sendPassword.bind(this)} className="w3-color-grey">Forgot password? Create a new one </a> 
                                }
                            </div>
                            <div className="w3-right"> 
                                <button  className="w3-button w3-round w3-blue" >Login</button>
                            </div>
                        </div>
                    </form>
                </div>   
            </Reveal>
        )
    }
} 

function mapStateToProps(state) {
    return {
        localBodies:state.LocalBodies,
    }
}
export default connect(mapStateToProps, { 
    metaMessage
})(Login);
