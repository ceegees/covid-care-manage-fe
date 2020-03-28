
import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import {Spinner,EmptyTRMessage,Message} from '../Common/Helper';
import {withRouter,Route,Link,NavLink} from 'react-router-dom';
import { connect } from 'react-redux'; 

import { metaMessage } from '../../redux/actions';
import AddUser from './../Modals/AddUser';
import AssignToOfficer from '../Modals/AssignToOfficer';
import VolunteerTaskList from './VolunteerTaskList';
import VolunteerList from './VolunteerList';
import OfficerList  from './OfficerList';
import {BarChart, Bar, XAxis,ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

function hasVolunteers(item){
    return item && ( item.category == 'Muncipality' || 
        item.category == 'Panchayath' ||
        item.category == 'Corporation');
}

class LBVisualization extends Component {
    render(){
        const {list} = this.props;
        const data = list.map(item => {
            return {
                name:item.name ,
                pending : item.json ? item.json.totalRequestSize - item.json.totalServicedSize : 0,
                completed:item.json ? item.json.totalServicedSize :0
            }
        });
        return  <div className="w3-center" style={{height:"240px",marginBottom:"40px"}}>
            <b>Activity Status</b>
            <ResponsiveContainer className="w3-section"  width="100%" >
            <BarChart data={data} >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" />
                <YAxis/>
                <Bar dataKey="pending" stackId="a" fill="#8884d8" />
                <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
                <Tooltip  cursor={{ stroke: 'rgba(0,0,0,0.1)',fill:'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                <Legend /> 
            </BarChart>
            </ResponsiveContainer>
      </div>
    }
}

class LocalBodyBrowser extends Component{

    constructor(arg){
        super(arg);
        this.state = {
            data:{},
            version:new Date().getTime(),
            modal:null
        }
    }
    
    hideModal(message){
        this.setState({modal:null});
        if (message =='reload'){
            this.loadData();
        } else if (message == 'reload_volunteers'){
            this.setState({
                version:new Date().getTime()
            });
        }
    }

    assignToOfficer(user){
        this.setState({
            modal:<AssignToOfficer id={this.props.match.params.parentId} 
            metaMessage={this.props.metaMessage}
            hideModal={this.hideModal.bind(this) } 
            user={user}/>
        })
    }

    loadData(){
        const {parentId=0} = this.props.match.params;
        axios.get(`/api/v1/manage/lb?lbid=${parentId}`).then(resp=>{
            if(!resp.data.meta.success){
                // this.props.metaMessage(resp.data.meta);
                this.props.history.push("/lb");
            } else {
                resp =resp.data;  
                this.setState({
                    data:resp.data
                });
            }
        })
    }

    componentDidMount(){
       this.loadData();
    }

    componentDidUpdate(prevProps,prevState){  
        if(prevProps.match.params.parentId != this.props.match.params.parentId){
            this.loadData();
            if (window){
                window.scrollTo(0,0)
            }
        }
    }

    showModal(body){
        this.setState({modal:<AddUser 
            hideModal={this.hideModal.bind(this)} 
            body={body} {...this.props}/>})
    }
    
    removeRole(item){ 
        const result = false;//confirm('Do you really want to remove ');
        if(result){
            axios.post('/api/v1/manage/remove-role',{id:item.id}).then(resp=>{
                this.props.metaMessage(resp.data.meta);
                if(resp.data.meta.success){
                    this.loadData();
                }
            });
        }
    }

    renderManagers(){
        const {officers,body} = this.state.data;
        const {authUser} = this.props;
        return <div className="w3-responsive w3-section ">
            <table className=" w3-table w3-table-all">
                <thead>
                    <tr>
                        <th> {body.category != 'Ward' ? 'Officer':'Officer'}</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th className="w3-right-align">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {officers.map(item => <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.userRole.role}</td> 
                    <td>
                        {authUser.role != 'OFFICER' &&    <button className="w3-red w3-right w3-button w3-round w3-padding-small w3-small" onClick={this.removeRole.bind(this,item.userRole)}>X</button>
                        }
                    </td>
                    </tr>)
                }
                {officers.length == 0 && <EmptyTRMessage colSpan="4">No Secretery Or Officers are added
                </EmptyTRMessage>}
                </tbody>
            </table>
        </div>
    }

    renderLocalBody(){

        const {children,body} = this.state.data;
        const {authUser} = this.props;
        return <div className="w3-responsive w3-section">
        <table className="w3-table w3-table-all ">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Volunteers / LO</th>
                    <th>In-Charge</th>
                    <th className="w3-right-align">Actions</th>
                </tr>
            </thead>
            <tbody>
            {children.map((item,idx) => { 
                let option = null;
                if(authUser.role == 'OFFICER'){
                    option = null;
                } else  if (item.category == 'Ward'){
                    option = <button onClick={this.showModal.bind(this,item)} className="w3-button w3-green w3-small w3-round w3-padding-small w3-right">Add Officer</button>
                } else  if (item.category == 'District'){
                    option = <button onClick={this.showModal.bind(this,item)} className="w3-button w3-green w3-small w3-round w3-padding-small w3-right">Add District Level Officer</button>
                } else if (authUser.role != 'VOLUNTEER'){
                    option = <button onClick={this.showModal.bind(this,item)} className="w3-button w3-teal w3-small w3-round w3-padding-small w3-right">Add Officer</button>
                }
                return <tr key={idx}>
                <td>{idx+1}</td>
                <td>
                    <NavLink to={`/lb/${item.category}/${item.id}`}>{item.name}  </NavLink>
                    <span className="w3-margin-left w3-small w3-text-grey w3-right">{item.category}</span>
                    <div className="w3-small w3-text-grey" >
                    Total Requests :{item.json? item.json.totalTaskCount:0}<br/>
                    Pending Requests :{item.json? item.json.totalRequestSize:0}<br/>
                    Requests Completed :{item.json? item.json.totalServicedSize:0}<br/></div>
                </td>
                <td className="w3-small ">
                    <div className="w3-hide">
                    {( item.category != 'Ward' ) ? 
                        <div>{`Volunteers Preference: ${item.volunteerCount}` }
                            <br/><a target="_blank" href={`/api/v1/manage/export-csv?code=${item.code}&dist=${item.district}`}>Download List</a></div>
                        : null 
                    }
                    Officers:{item.officerCount}
                    </div>    
                </td>

                <td><ol className="w3-ol w3-small">{item.userRoles.map(item=>{
                    return <li key={item.user.id}>{item.user.name}
                        <span style={{textTransform:'capitalize'}} 
                            className="w3-margin-left w3-text-grey w3-tiny w3-right">({item.role.toLowerCase()})       
                        </span>
                     </li>
                    })}
                    </ol>
                </td>
                <td>
                    {option}
                </td>
            </tr>})}
            {children.length == 0 && 
                <tr>
                    <td colSpan="6" className="w3-center w3-text-grey">
                        No Local Bodies are present under
                    </td>
                </tr>
            }
            </tbody>
        </table>
        </div>
    }

    render (){
        const {body,children,tasks} = this.state.data;  
        const {type,parentId,tab} = this.props.match.params;
        let content = null;
        if(!children){
            content = <Spinner/>
        } else if (type == 'Ward' && body){
            content = <VolunteerTaskList url={`/api/v1/task/assigned?lbid=${parentId}`}  />
        } else if (tab == 'volunteers') {
            content = <VolunteerList 
                localBody={body} 
                version={this.state.version}  
                assignToOfficer={this.assignToOfficer.bind(this)} />
        } else if (tab == 'officers') {
            content =  <OfficerList  
                localBody={body} version={this.state.version}  />
        } else {
            content = this.renderLocalBody();
        }
        return <div className="w3-row-padding">
                <div className="w3-bar">
                {body && (body.parent ?  <Link className="w3-bar-item w3-padding"  to={`/lb/${body.parent.category}/${body.parent.id}`}>Back </Link>  : <Link className="w3-bar-item" to="/lb">Back</Link>) } 
                <h3 className="w3-center"> {body ? `${body.name} ${body.category} ` :'Kerala State'}</h3>
                </div>
                {body && this.renderManagers()}

                {children && children.length > 0 &&  
                    <LBVisualization list={children} />
                }
                { hasVolunteers(body) && <div className=" w3-bar w3-section w3-light-grey">
                        <NavLink to={`/lb/${type}/${parentId}/`} 
                            exact activeClassName="w3-blue" className="w3-bar-item w3-button">Wards</NavLink>
                        <NavLink to={`/lb/${type}/${parentId}/volunteers`}  
                            activeClassName="w3-blue"  className="w3-bar-item w3-button">Volunteers</NavLink>  

                        <NavLink to={`/lb/${type}/${parentId}/officers`}  
                            activeClassName="w3-blue"  className="w3-bar-item w3-button">Officers</NavLink>  
                    </div>
                }
                {content}
                {this.state.modal} 
            </div> 
    }

}

const mapStateToProps = (state) =>{
    return {
        authUser:state.authUser
    }
}

export default connect(mapStateToProps, { 
    metaMessage, 
})(withRouter(LocalBodyBrowser));
