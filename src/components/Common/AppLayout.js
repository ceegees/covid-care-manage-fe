import React,{Component} from 'react';
import {  NavLink, Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import $ from 'jquery'; 
class AppLayout extends Component {
    constructor(arg) {
        super(arg);
        this.state = {
            menuCls: ''
        };
    }
    componentDidMount() {
       
        $('body').addClass('loggedIn');
    }
    toggleClass() {
        this.setState({
            menuCls: this.state.menuCls == 'w3-hide-small' ? '' : 'w3-hide-small'
        })
    }
    render() {
        const { authUser } = this.props;
        if (!authUser) {
             return this.props.children;
        }
        return <div className="w3-animate-opacity">
            <section className="top_section w3-small">
                <nav className="w3-bar w3-white  header-top-bar" >
                    <div className="w3-left">
                        <Link className="w3-bar-item w3-button   w3-small" to="/"><b>REBUILD Kerala</b></Link>
                    </div>
                    <div className="w3-right"  >
                        <Link className="w3-bar-item w3-small w3-button" to="/settings">{`Hi ${authUser.name}`}</Link>
                        <a className="w3-bar-item w3-button   w3-small" href="/logout">Logout</a>
                        <button onClick={this.toggleClass.bind(this)} className="w3-bar-item w3-button w3-hide-medium w3-hide  w3-small">Menu</button>
                    </div>
                </nav>
            </section>
            <div className="w3-row-padding w3-margin-top">
                <div className={`w3-col m3  w3-margin-bottom ` + this.state.menuCls}>
                    <div className="w3-light-grey">
                        <div className="w3-center w3-padding-32 w3-white">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Kerala_Government_Emblem.png" style={{ height: "62px" }} />
                        </div>
                        <NavLink to='/' exact activeClassName="w3-blue" className="w3-block w3-border-bottom w3-button">Dashboard</NavLink>

                        <NavLink to='/requests/pending' exact activeClassName="w3-blue" className="w3-block w3-border-bottom w3-button">Pending Requests</NavLink>
                        {this.props.authUser.role == 'OFFICER' &&
                            <NavLink to={'/created'} activeClassName="w3-blue" className="w3-block w3-border-bottom w3-button">Tasks</NavLink>}
                        {this.props.authUser.role != 'VOLUNTEER' &&
                            <NavLink to={'/lb'} activeClassName="w3-blue" className="w3-block w3-border-bottom w3-button">Local Bodies</NavLink>}
                        <NavLink to={'/settings'} activeClassName="w3-blue" className="w3-block  w3-border-bottom w3-button">Settings</NavLink>
                        <a className="w3-block w3-button w3-hide w3-hide-large" href="/logout">Logout</a>
                    </div>
                </div>
                <div className="w3-col m9" >
                    <div className="w3-white" style={{ minHeight: "100vh" }}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>
    }
} 

export default withRouter(AppLayout);