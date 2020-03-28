import React,{Component} from 'react';
import { connect } from 'react-redux'; 
import { Link , withRouter} from 'react-router-dom';   
import {setSearch} from '../../redux/actions'; 
import { showModal } from './../../redux/actions.js';   
import Login from './../Modals/Login';   


class Header extends Component {
    constructor(arg) {
        super(arg);
        this.state = { 
            modalContent:null
        }
    }

    hideModal() {
        this.showModal('empty');
    }

    showModal(name,data){
        let content = null; 
        if (name == 'volunteer_login') {
            content = <Login localBodies={[]}  hideModal={this.hideModal.bind(this)} />
        } else if (name == 'officer_login') {
            content = <Login  localBodies={[]}  type="SELF" hideModal={this.hideModal.bind(this)} />
        }  
        this.setState({modalContent:content});
    }  
    render(){
        const {authUser} = this.props;
        return (
            <section className="top_section w3-small"> 
                <nav className="w3-bar  header-top-bar" style={{padding:"2px"}}>
                    <div className="w3-left">
                        <a className="w3-bar-item w3-padding-small" href="/">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Kerala_Government_Emblem.png" style={{height:"62px"}}/>
                         </a> 
                    </div> 
                        {!authUser ? 
                            <div className="w3-right w3-section">   
                        <button className=" w3-bar-item w3-button w3-green " onClick={e => this.showModal('volunteer_login')}>Volunteer Login</button>  
                        <button className="w3-bar-item w3-button w3-deep-orange " onClick={e => this.showModal('officer_login')}>Officer Login</button>  
                        
                    </div>
                        
                         :<div className="w3-right"
                         ><div className="w3-bar w3-green">
                         {authUser ? <Link className="w3-bar-item w3-white" to="/settings">{`Hi ${authUser.name}`}</Link> :null}
                    <a className="w3-bar-item w3-right w3-button w3-blue-grey"  href="/logout">Logout</a>
                </div></div>}
                </nav> 
                 
                {this.props.children}
                {this.state.modalContent}
            </section> 
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser, 
        statusList:state.statusList,
        modalInfo:state.modalInfo
    }
}

export default withRouter(connect(mapStateToProps,{
    setSearch,
    showModal
})(Header));