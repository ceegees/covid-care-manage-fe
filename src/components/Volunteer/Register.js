import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,ErrorHelperText ,SelectField} from '../Common/Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';
import {  metaMessage,getLocalBodyOptions } from '../../redux/actions.js';

import Select from 'react-select'

class Register extends Component{

    constructor(arg) {
        super(arg);
        this.state =   { 
             
            showOTPForm:false,
            form: {
                workPreference:[],
                dayPreference:[]
            },
            localBodyNames:[],
            errors: {}, 
            successMessage: '',
            isSending: false
        }
    }

    changeFormValue(name,value) {
         
        if (name == 'district'){
            if(this.state.form.district != value){ 
                this.state.form.workPreference = [];
            }
            this.state.form[name] = value;
            const dist = this.props.localBodies.find(item => item.name == value);

            if (dist) {  
                this.setState({
                    localBodyNames:getLocalBodyOptions(dist.bodies)
                })
            } else {
                this.setState({
                    localBodyNames:[]
                })
            }
        } else {
            this.state.form[name] = value; 
        } 
    }


    dayPreferenceChange(vals){
        this.setState({
            form:Object.assign(this.state.form,{
                dayPreference:vals
            })
        });
    }

    preferenceChange(vals){ 
        this.setState({
            form:Object.assign(this.state.form,{
                workPreference:vals
            })
        });
    }

 
    cancelOTP(){
        this.setState({
            showOTPForm:false,
        })
    }

    handleVerify(e) {
        e.preventDefault();
        e.stopPropagation();
        const {isSending} = this.state;
        if (isSending) {
            return;
        }

        let formData = Object.assign({},this.state.form); 
        let errors = {};
        if (!formData.contactName) {
            errors['contactName'] = "Name is required"
        } else if(!formData.contactName.match(/^([A-Za-z\. ]){2,100}$/)){
            errors['contactName'] = 'Name can contain only alphabets';
        }
        if (!formData.phoneNumber) {
            errors['phoneNumber'] = "Phone Number is required";
        } else if (!formData.phoneNumber.match(/^([0-9]){9,15}$/)){
            errors['phoneNumber'] = "Phone Number is Invalid";
        }

        if (!formData.district) {
            errors['district'] = "District is required"
        } 
        if (!formData.address) {
            errors['address'] = "Address is required"
        }

        if (!formData.password) {
            errors['password'] = "Password password";
        } else if (formData.password.length < 6){
            errors['password'] = "Select a password with minimum 6 characters";
        }

        if (!formData.email) {
            errors['email'] = "Email is Required";
        } 

        if (!formData.confirmPassword) {
            errors['confirmPassword'] = "Password Confirmation is Required";
        }

        if (formData.password != formData.confirmPassword){
            errors['confirmPassword'] = "Password and Confirmation doesnt match";
        }

        if (formData.workPreference.length == 0){
            errors['workPreference'] = 'You need to mark your preference'
        } 

        if (formData.dayPreference.length == 0){
            errors['dayPreference'] = 'You need to mark days you are available'
        } 
        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }
        this.setState({
            isSending: true
        });
        axios.post('/api/v1/auth/send-otp',formData)
        .then(resp=> {
            resp = resp.data;
            this.props.metaMessage(resp.meta);

            if (resp.meta.success) { 
                this.setState({
                    errors: {},
                    showOTPForm:true,
                }); 
            }
            this.setState({
                isSending: false
            });
        }); 
    }

    handleSubmit(){
        let formData = Object.assign({},this.state.form); 
        let errors = {};
        if (!formData.otp) {
            errors['otp'] = "OTP is required"
        }
        if (Object.keys(errors).length != 0) {
            this.setState({
                errors
            });
            return false;
        }

        axios.post('/api/v1/auth/register',formData).then(resp=>{ 
            resp = resp.data
            this.props.metaMessage(resp.meta);
            if (resp.meta.success){
                // document.location.reload();
            }  
        }).catch(ex=>{
            console.log(ex);
        });

    }
    render(){
        var clsSuccess = 'hidden';
        if (this.state.successMessage != '') {
            clsSuccess = '';
        }
        var clsDataForm = 'w3-show';
        var clsOtpForm = 'w3-hide';

        if (this.state.showOTPForm){
            clsOtpForm = 'w3-show';
            clsDataForm= 'w3-hide';
        }
        var googlePlace = this.state.setLocation && this.state.setLocation.location ? this.state.setLocation.location : '';
        let options = [];
        if (this.state.form.workPreference.length < 5){
            options = this.state.localBodyNames;
        }
      
        return (
            <div className="w3-row-padding" >
                <div className="w3-col m5 s12 w3-margin-bottom   ">
                    <div className=""> 
                        <div className=" w3-center kf-image-banner w3-container w3-padding-32">
                            <h3>We found unity in the face of adversity.</h3>
                            <div className="w3-padding">
                            <h5 className="" >
                            Let's double our efforts to not just rebuild, but build a new Kerala - to bring back to her original strength and beauty.
                            </h5>
                            <h5>
                                Come, Let us join hands and Rebuild Nava Keralam, God's Own Country, Our Own Country.
                            </h5>
                            </div>
                            <div className="w3-hide">
                            We would like to extend our heartfelt gratitude to everyone who supported Kerala during the recent trying times.<br/><br/>
                            We hope that you continue to support Kerala as she recovers her original strength and beauty.<br/><br/>

                            Come, let us join hands and Rebuild Nava Keralam, God's Own Country, Our Own Country.<br/><br/>

                            By registering as a volunteer, you can help us with our first step -  assessment of the damages caused by the floods. Please sign up and join our effort!  Keralarescue.in moves on to rebuildkerala.gov.in 
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="w3-col m7 s12">
                    <div className="">
                        <div className="w3-container w3-padding w3-border kf-semi-white ">   
                            <form className={`w3-center  w3-padding-64 ${clsOtpForm}`} action="/api/v1/auth/register" method="POST">
                                <h4 className="w3-center w3-margin" style={{paddingBottom: "10px"}}>
                                    <div className="w3-center">
                                        <div className="w3-row">Verify your mobile number with OTP</div> 
                                    </div>
                                </h4>   
                                <div className="w3-row-padding" style={{margin:'auto',maxWidth:"400px"}}>
                                    <div className="l12 s12  w3-col w3-margin-bottom">
                                        <FormTextField 
                                            label="Enter OTP received as SMS on Phone"
                                            placeholder="Enter OTP received "
                                            name="otp"
                                            isMandatory="true"
                                            inputClass="w3-input w3-border"
                                            value = {this.state.form.otp}
                                            valueChange={this.changeFormValue.bind(this)}
                                            errors = {this.state.errors.otp} /> 
                                    </div>

                                    <div className="l12 w3-center s12 w3-col"> 
                                            <button type="button" className="w3-button w3-margin-bottom w3-block w3-green" 
                                                onClick={this.handleSubmit.bind(this)}
                                                disabled={(this.state.isSending)?true:false}>Register</button>  
                                            <button type="button" onClick={this.cancelOTP.bind(this)} 
                                            disabled={(this.state.isSending)?true:false}
                                            className="w3-button w3-margin-bottom w3-block w3-blue"  >Change Details</button>
                                            <button type="button" onClick={this.handleVerify.bind(this)} 
                                            disabled={(this.state.isSending)?true:false}
                                            className="w3-button w3-block w3-margin-bottom w3-red"  >Resend OTP</button>
                                    </div>
                                </div>

                            </form>
                            <form className={`w3-row w3-section ${clsDataForm} `} action="/api/v1/auth/register"  method="POST"
                                onSubmit={this.handleVerify.bind(this)}> 
                                <div className="w3-col l12 s12">
                                    <h4 className="w3-center w3-margin-bottom">Register as a Damage Assessment Volunteer  
                                </h4> 
                                </div>
                                <div className="w3-col l12 s12 w3-row-padding">
                                <div className="l4 s12 w3-col">
                                    <FormTextField 
                                        label="പേര്"
                                        placeholder="Name"
                                        name="contactName"
                                        isMandatory="true"
                                        inputClass="w3-input w3-border"
                                        value = {this.state.form.contactName}
                                        valueChange={this.changeFormValue.bind(this)}
                                        errors = {this.state.errors.contactName} /> 
                                </div>
                                <div className="l4 s12 w3-col">
                                    <FormTextField
                                        label="മൊബൈൽ നമ്പർ"
                                        placeholder="Mobile Phone Number"
                                        name="phoneNumber"
                                        isMandatory="true"
                                        type="number"
                                        value = {this.state.form.phoneNumber}
                                        inputClass="w3-input w3-border"
                                        valueChange={this.changeFormValue.bind(this)}
                                        errors = {this.state.errors.phoneNumber} />
                                </div>
                                <div className="l4 s12 w3-col">
                                    <FormTextField
                                        label="ഇമെയിൽ"
                                        placeholder="Email"
                                        name="email"
                                        type="email"
                                        isMandatory="true"  
                                        value = {this.state.form.email}
                                        inputClass="w3-input w3-border"
                                        valueChange={this.changeFormValue.bind(this)}
                                        errors = {this.state.errors.email} />
                                </div>
                                </div>
                                <div className="w3-row-padding w3-col l12 s12 w3-section" > 
                                    <div className="w3-col l4 s12">
                                        <label className="w3-block">Days you are available for Volunteering <span className="w3-text-red">*</span></label>
                                    </div>
                                    <div className="l8 s12 w3-col">  
                                        <Select options={this.props.days}
                                            onChange={this.dayPreferenceChange.bind(this)}
                                            value={this.state.form.dayPreference}
                                            labelName="name"
                                            isMulti={1}/> 
                                        <ErrorHelperText errors={this.state.errors.dayPreference} />
                                    </div>
                                </div>
                                <div className="w3-col l12 s12 w3-row-padding">
                                    <div className="l4 s12 w3-col">
                                        <SelectField
                                            label="ജില്ല (District)"
                                            place="district"
                                            name="district"
                                            selectClass="w3-select  w3-border"
                                            isMandatory="true"
                                            value = {this.state.form.district}
                                            valueChange={this.changeFormValue.bind(this)}
                                            errors = {this.state.errors.district}>
                                            <option value="">- Select District -</option>
                                            {this.props.localBodies && this.props.localBodies.sort((a,b) => {
                                                return a.name.localeCompare(b.name)
                                            }).map(item =>{
                                                return <option key={item.name} value={item.name}>{item.name}</option>
                                            })}
                                        </SelectField> 
                                    </div>

                                    <div className="l8 s12 w3-row-padding w3-col">
                                        <label>Select your LSGI preference in order <span         className="w3-color-light-grey w3-small">(maximum 5)</span>
                                        <span className="w3-text-red">*</span>
                                        </label>
                                        <Select options={options}
                                            onChange={this.preferenceChange.bind(this)} 
                                            isMulti={1}/> 
                                        <ErrorHelperText errors={this.state.errors.workPreference} />
                                    </div>
                                </div>
                                <div className="w3-col w3-row-padding l12 s12">
                                <div className="w3-col l6 s12">
                                    <FormTextarea 
                                        name="address"
                                        label="അഡ്രെസ്സ്"
                                        placeholder="Address" 
                                        isMandatory="true"
                                        inputClass="w3-input w3-border" 
                                        valueChange={this.changeFormValue.bind(this)}
                                        value = {this.state.form.address}
                                        errors = {this.state.errors.address}
                                        type="text" />
                                </div>
                                <div className="w3-col l6 s12" >
                                    <FormTextarea 
                                        name="information"
                                        label="കൂടുതൽ വിവരങ്ങൾ"
                                        placeholder="More Information about preference / availability" 
                                        inputClass="w3-input w3-border" 
                                        valueChange={this.changeFormValue.bind(this)}
                                        value = {this.state.form.information}
                                        type="text" />
                                </div>
                                </div>
                                <div className="w3-col l12 s12 w3-row-padding">
                                <div className="w3-col  l6 s12 " >
                                <FormTextField
                                    label="രഹസ്യകോഡ്‌ (പുതിയത്)"
                                    name="password"
                                    placeholder="Password"
                                    isMandatory="true" 
                                    type="password"
                                    value = {this.state.form.password}
                                    inputClass="w3-input w3-border"
                                    valueChange={this.changeFormValue.bind(this)}
                                    errors = {this.state.errors.password} />
                                </div>

                                <div className="w3-col l6 s12 " >
                                <FormTextField
                                    label="രഹസ്യകോഡ്‌ സ്ഥിരീകരിക്കുക"
                                    placeholder="Confirm Password"
                                    type="password"
                                    isMandatory="true" 
                                    name="confirmPassword" 
                                    value = {this.state.form.confirmPassword}
                                    inputClass="w3-input w3-border"
                                    valueChange={this.changeFormValue.bind(this)}
                                    errors = {this.state.errors.confirmPassword} />
                                </div>
                                <div className={" w3-col m12 s12 l12 "}  > 
                               <button className="w3-button w3-right w3-round w3-margin-top w3-blue" 
                                            disabled={(this.state.isSending)?true:false}>Submit</button>
                                 <a  className="w3-left w3-section w3-hide" target="_blank" style={{textDecoration:'none',lineHeight:"40px"}} href="https://play.google.com/store/apps/details?id=in.gov.ikm.disasterreliefsupport">
                                സർവ്വേ അപ്ലിക്കേഷൻ ഡൌൺലോഡ് ചെയ്യുക <img style={{height:"36px",padding:"4px"}} src="https://play.google.com/intl/en_us/badges/images/badge_new.png"/></a> 
                                    
                                </div>
                                </div>
                            </form>
                        </div>    
                    </div>
                </div>
            </div>
        )
    }   
} 
function mapStateToProps(state) {
    return {
        requestTypeList:state.requestTypeList, 
        localBodies:state.LocalBodies,
        days:state.Days
    }
}
export default connect(mapStateToProps, { 
    metaMessage
})(Register);

 