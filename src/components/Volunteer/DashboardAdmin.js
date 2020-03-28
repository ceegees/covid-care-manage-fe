

import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import {Spinner,EmptyTRMessage} from '../Common/Helper';
import {withRouter,Route,Switch,NavLink} from 'react-router-dom';
import { connect } from 'react-redux'; 
import moment from 'moment';
import { metaMessage } from '../../redux/actions';
import LocalBodyBrowser from './LocalBodyBrowser';
import Settings from './Settings';
import {BarChart, Bar, XAxis,ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import VolunteerList from './VolunteerList';
 
const TRTooltip = ({more}) =>{
    return <span style={{zIndex:'100'}}  className="w3-text w3-display-topleft w3-bar w3-tag w3-black">~ Over in {more}  days <br/>{moment().add(more,'days').format('YYYY-MM-DD')} </span>
}
class Stats extends Component{
    constructor(args){
        super(args);
        this.state = {
            list:[],
            stats:null,
            overall:null,
        }
    }

    componentDidMount(){ 
        axios.get('/api/v1/manage/list-officers').then(resp=>{
            resp = resp.data;
            if (!resp.meta.success) {
                return this.props.metaMessage(resp.meta);
            }
            this.setState({ list:resp.data});
        });
        axios.get('/api/v1/manage/stats').then(resp=>{
            if (!resp.data.meta.success){
                return this.props.metaMessage(resp.data.meta);
            }
            this.setState({stats:resp.data.data});
        })
        axios.get('/api/v1/manage/overall-stats').then(resp => {
            if (!resp.data.meta.success){
                return this.props.metaMessage(resp.data.meta);
            }
            this.setState({
                overall:resp.data.data
            })
        })
    }
    renderCharts(){
        const {overall} = this.state;
        if (!overall ){
            return <Spinner />;
        }
        
        const volunteer = overall.people.find(item => item.role == 'VOLUNTEER' && item.assigned == 1 );
        const unassigned = overall.people.find(item => item.role == 'VOLUNTEER' && item.assigned ==0 );
        const officers = overall.people.find(item => item.role == 'OFFICER');
        return <React.Fragment>

            <div className="w3-col m4  s12">
                <div className="w3-card w3-green  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Approved <br/>Requests :
                    {volunteer ? VolunteerList.total:0}
                </div>
            </div>
            <div className="w3-col m4 s12 ">
                <div  className="w3-card w3-deep-orange  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Pending <br/> Requests :
                    {unassigned ? unassigned.total: 0 }
                </div>
            </div>
            <div className="w3-col m4 s12 ">
                <div  className="w3-card w3-teal  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Rejected <br/> Requests : 
                    {officers ? officers.total: 0}
                </div>
            </div>
            
            <div className="w3-col l6 s12 w3-margin-top">
                <div className="w3-center" style={{height:"240px",marginBottom:"40px"}}>
                    <b>Survey Request Creation trend</b>
                    <ResponsiveContainer className="w3-section"  width="100%" >
                    <BarChart data={overall.taskCreationTrend} >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" />
                        <YAxis/>
                        <Bar dataKey="created"  fill="#8884d8" />
                        <Bar dataKey="completed"   fill="#82ca9d" />
                        <Tooltip  cursor={{ stroke: 'rgba(0,0,0,0.1)',fill:'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                        <Legend /> 
                    </BarChart>
                    </ResponsiveContainer>
                </div> 
            </div>
            <div className="w3-col l6 s12 w3-margin-top">
                <div className="w3-center" style={{height:"240px",marginBottom:"40px"}}>
                    <b>Survey Completion Trend</b>
                    <ResponsiveContainer className="w3-section"  width="100%" >
                    <BarChart data={overall.taskCompletionTrend} >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" />
                        <YAxis/>
                        <Bar dataKey="completed" fill="#82ca9d" />
                        <Tooltip  cursor={{ stroke: 'rgba(0,0,0,0.1)',fill:'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                        <Legend /> 
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </React.Fragment>

    }
    renderStats(){
        if (!this.state.stats){
            return <Spinner />;
        }

        let folded = this.state.stats.users.reduce((acc,item) => {
            if (!item.district){
                return acc;
            }
            if (!acc[item.district]){
                acc[item.district] = {
                    name:item.district || 'Not Updated',
                    admin:0,
                    volunteer:0,
                    officer:0,
                    manager:0
                }
            }
            if (item.role){
                acc[item.district][item.role.toLowerCase()]= item.people_count;
            }
            return acc;
        },{})

        folded = Object.values(folded).sort((a,b) => a.name && b.name && a.name.localeCompare(b.name) );
        const total =this.state.stats.tasks.reduce((s,i) => s +parseInt(i.surveys_total) ,0);
        const completed = this.state.stats.tasks.reduce((s,i) => s +parseInt(i.surveys_completed) ,0);

        const daysPassed = moment().diff(moment('2018-09-08T00:00:00Z'),'days');
        const rate = completed/daysPassed;
        const totalLeft =  Math.ceil((total-completed)/rate)

        return <div className="w3-margin-bottom">
            <h4>Stats <span className="w3-margin-left w3-small w3-text-grey ">Surveys Started On 2018-09-08</span></h4>
            <table className="w3-table w3-small w3-table-all w3-margin-bottom" >
                <thead>
                    <tr>
                        <th>District</th>
                        <th>Tasks</th>
                        <th>Assigned Surveys</th>
                        <th>Completed Surveys</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.stats.tasks.map(row => { 
                        const perc = (row.surveys_completed*100/row.surveys_total).toPrecision(3);
                        const rate = row.surveys_completed/daysPassed;
                        const more = Math.ceil((row.surveys_total-row.surveys_completed)/rate)
                        return <tr key={row.district}>
                            <td >{row.district }</td>
                            <td>{row.task_count}</td>
                            <td>{row.surveys_total} </td>
                            <td className="w3-tooltip">{row.surveys_completed}
                                <span className="w3-text-grey w3-right" >{perc}%</span>
                                {row.surveys_completed > 0 && <TRTooltip more={more} /> }
                            </td>
                        </tr>
                    })}
                    <tr>
                        <td><b>Total</b></td> 
                        <td><b>{this.state.stats.tasks.reduce((s,i) => s + parseInt(i.task_count) ,0)}</b></td>
                        <td><b>{total}</b></td>
                        <td  className="w3-tooltip" ><b>{completed} <span className="w3-text-grey w3-right"> {(completed*100/total).toPrecision(3)}%</span></b>
                        {
                            completed > 0 && <TRTooltip more={totalLeft} />
                        }
                        </td> 
                    </tr>
                </tbody>
            </table>
            <table className="w3-table w3-small w3-table-all w3-margin-bottom">
                <thead>
                    <tr><th>District</th> 
                        <th>Secretaries</th>
                        <th>Officers </th>
                        <th>Volunteers </th></tr>
                </thead>
                <tbody>
                    {folded.map(row => {
                       return <tr key={row.name}>
                            <td>{row.name}</td> 
                            <td>{row.manager}</td>
                            <td>{row.officer}</td>
                            <td>{row.volunteer}</td></tr>
                    })
                    }
                    <tr>
                        <td><b>Total</b></td> 
                        <td><b>{folded.reduce((s,i) => s + parseInt(i.manager) ,0)}</b></td>
                        <td><b>{folded.reduce((s,i) => s +parseInt(i.officer) ,0)}</b></td>
                        <td><b>{folded.reduce((s,i) => s +parseInt(i.volunteer) ,0)}</b></td> 
                    </tr>
                </tbody>
            </table>
        </div>
    }
    render(){
        return <div className="w3-white">
            <div className="w3-row-padding ">
                <div className="w3-col l12">
                   <h3>Admin Dashboard</h3> 
                </div>
                {this.renderCharts()}
                <div className="w3-col l6 s12 w3-responsive">
                    {this.renderStats()}
                </div>
                <div className="w3-col l6 s12 w3-responsive w3-margin-bottom">
                    <h4>District Level Officers</h4>
                    <table className="w3-table w3-small w3-table-all">
                        <thead>
                            <tr><th>Name</th>
                                <th>Phone</th>
                                <th>District / LSGI</th>
                                <th>Status</th></tr>
                        </thead>
                        <tbody>
                            {!this.props.localBodies && <EmptyTRMessage colSpan="4"><Spinner/></EmptyTRMessage>
                            }
                            {
                                
                                this.props.localBodies &&  this.state.list.map(item => {
                                    const dist = this.props.localBodies.find(i => i.name == item.district);
                                    let lb = null;
                                    if (dist && dist.bodies[item.team] ){
                                        lb = dist.bodies[item.team];
                                    } 
                                    if (!lb){
                                        lb = item.district;
                                    }
                                return <tr key={item.name}><td>{item.name}</td>
                                    <td>{item.phoneNumber}</td> 
                                    <td>{lb}</td>
                                    <td>{item.status}</td></tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
    }
}

class DashboardAdmin extends Component {
    render(){
        return <Switch>
            <Route path="/lb/:type?/:parentId?/:tab?"  render={params => {
               return <LocalBodyBrowser {...params}  />
            } }/>
            <Route exact path="/settings" component={Settings}/>
            <Route path="/" render={props => {
                return <Stats {...props} metaMessage={this.props.metaMessage} localBodies={this.props.localBodies} />} 
            }/>
        </Switch>
    }
}

const mapStateToProps = (state) =>{
    return {
        authUser:state.authUser,
        localBodies:state.LocalBodies
    }
}

export default connect(mapStateToProps, { 
    metaMessage, 
})(withRouter(DashboardAdmin));