

import React, { Component } from 'react';
import axios from 'axios';
import { Spinner, EmptyTRMessage } from '../Common/Helper';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { metaMessage } from '../../redux/actions';
import {
    BarChart, Bar, XAxis, ResponsiveContainer,
    YAxis, CartesianGrid, Tooltip, Legend, Cell,
    PieChart, Pie

} from 'recharts';

const TRTooltip = ({ more }) => {
    return <span style={{ zIndex: '100' }} className="w3-text w3-display-topleft w3-bar w3-tag w3-black">~ Over in {more}  days <br />{moment().add(more, 'days').format('YYYY-MM-DD')} </span>
}
function pieTooltip(value, name, props) {
    const perc = (value/ props.payload.total)
    return [`${(100 * perc.toPrecision(4)).toFixed(2)} %`, name]
}
class DashboardAdmin extends Component {
    constructor(args) {
        super(args);
        this.state = {
            list: [],
            pieData: [],
            stats: null,
            overall: null,
        }
    }

    componentDidMount() {
        axios.get('/api/v1/manage/list-officers').then(resp => {
            resp = resp.data;
            if (!resp.meta.success) {
                return this.props.metaMessage(resp.meta);
            }
            this.setState({ list: resp.data });
        });
        axios.get('/api/v1/manage/stats').then(resp => {
            if (!resp.data.meta.success) {
                return this.props.metaMessage(resp.data.meta);
            }
            this.setState({ stats: resp.data.data });
        })
        axios.get('/api/v1/manage/overall-stats').then(resp => {
            if (!resp.data.meta.success) {
                return this.props.metaMessage(resp.data.meta);
            }
            const stats = resp.data.data.stats;
            const approvedGrp = stats.find(item => item.status == 'APPROVED');
            const pendingGrp = stats.find(item => item.status == 'PENDING');
            const rejectedGrp = stats.find(item => item.status == 'REJECTED');

            const pendingTotal = pendingGrp ? parseInt(pendingGrp.total) : 0;
            const approvedTotal = approvedGrp ? parseInt(approvedGrp.total) : 0;
            const rejectedTotal = rejectedGrp ? parseInt(rejectedGrp.total) : 0;
            const total = pendingTotal + rejectedTotal + approvedTotal
            this.setState({
                overall: resp.data.data,
                pendingTotal,
                approvedTotal,
                rejectedTotal,
                pieData: [
                    { name: 'Pending', value: pendingTotal, total },
                    { name: 'Approved', value: approvedTotal, total },
                    { name: 'Rejected', value: rejectedTotal, total },
                ]
            })
        })
    }
    renderCharts() {
        const { overall, pendingTotal, approvedTotal, rejectedTotal } = this.state;
        if (!overall) {
            return <Spinner />;
        }

        return <React.Fragment>
            <div className="w3-col m4 s12 ">
                <div className="w3-card w3-yellow  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Pending <br /> Requests :
                    {pendingTotal}
                </div>
            </div>
            <div className="w3-col m4  s12">

                <div className="w3-card w3-green  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Approved <br />Requests :
                    {approvedTotal}
                </div>
            </div>

            <div className="w3-col m4 s12 ">
                <div className="w3-card w3-grey  w3-center w3-padding-32 w3-xlarge w3-margin-bottom">
                    Rejected <br /> Requests :
                    {rejectedTotal}
                </div>
            </div>

            <div className="w3-col l6 s12 w3-margin-top">
                <div className="w3-center" style={{ height: "240px", marginBottom: "40px" }}>
                    <b>Request Creation trend</b>
                    <ResponsiveContainer className="w3-section" width="100%" >
                        <BarChart data={overall.taskCreationTrend} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Bar dataKey="created" fill="#E4E400" />
                            <Bar dataKey="completed" fill="#82ca9d" />
                            <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.1)', fill: 'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="w3-col l6 s12 w3-margin-top">
                <div className="w3-center" style={{ height: "240px", marginBottom: "40px" }}>
                    <b>Completion Trend</b>
                    <ResponsiveContainer className="w3-section" width="100%" >
                        <BarChart data={overall.taskCompletionTrend} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Bar dataKey="completed" fill="#82ca9d" />
                            <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.1)', fill: 'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </React.Fragment>

    }
    renderStats() {
        const { stats } = this.state;
        if (!stats) {
            return <Spinner />;
        }

        let folded = stats.users.reduce((acc, item) => {
            if (!item.district) {
                return acc;
            }
            if (!acc[item.district]) {
                acc[item.district] = {
                    name: item.district || 'Not Updated',
                    admin: 0,
                    volunteer: 0,
                    officer: 0,
                    manager: 0
                }
            }
            if (item.role) {
                acc[item.district][item.role.toLowerCase()] = item.people_count;
            }
            return acc;
        }, {})

        folded = Object.values(folded).sort((a, b) => a.name && b.name && a.name.localeCompare(b.name));
        const total = stats.tasks.reduce((s, i) => s + parseInt(i.total), 0);
        const completed = stats.tasks.reduce((s, i) => s + parseInt(i.completed), 0);

        const daysPassed = moment().diff(moment('2020-03-26T00:00:00Z'), 'days');
        const rate = completed / daysPassed;
        const totalLeft = Math.ceil((total - completed) / rate)
        const totalPending = total - completed;

        return <div className="w3-margin-bottom">
            <h4>Stats <span className="w3-margin-left w3-small w3-text-grey ">Started On 2020-03-26</span></h4>
            <table className="w3-table w3-small w3-table-all w3-margin-bottom" >
                <thead>
                    <tr>
                        <th>District</th>
                        <th>Tasks</th>
                        <th>Pending</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.tasks.map(row => {
                        const perc = (row.completed * 100 / row.total).toPrecision(3);
                        const rate = row.completed / daysPassed;
                        const more = Math.ceil((row.total - row.completed) / rate)
                        return <tr key={row.district}>
                            <td >{row.district}</td>
                            <td>{row.total}</td>
                            <td>{row.total - row.completed} </td>
                            <td className="w3-tooltip">{row.completed}
                                <span className="w3-text-grey w3-right" >{perc}%</span>
                                {row.completed > 0 && <TRTooltip more={more} />}
                            </td>
                        </tr>
                    })}
                    <tr>
                        <td><b>Total</b></td>
                        <td><b>{total}</b></td>
                        <td><b>{totalPending}</b></td>
                        <td className="w3-tooltip" ><b>{completed} <span className="w3-text-grey w3-right"> {(completed * 100 / total).toPrecision(3)}%</span></b>
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
                        <td><b>{folded.reduce((s, i) => s + parseInt(i.manager), 0)}</b></td>
                        <td><b>{folded.reduce((s, i) => s + parseInt(i.officer), 0)}</b></td>
                        <td><b>{folded.reduce((s, i) => s + parseInt(i.volunteer), 0)}</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
    render() {
        const { pieData } = this.state;
        const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

        return <div className="w3-white">
            <div className="w3-row-padding ">
                <div className="w3-col l12">
                    <h3>Admin Dashboard</h3>
                </div>
                {this.renderCharts()}
                <div className="w3-col l6 s12 w3-responsive">
                    {this.renderStats()}
                </div>
                <div className="w3-col l6 s12 w3-margin-bottom" style={{ height: "440px" }}>
                    <ResponsiveContainer className="w3-section" width="100%"  >
                        <PieChart width={400} height={400}>
                            <Tooltip formatter={pieTooltip} />
                            <Legend verticalAlign="top" />
                            <Pie
                                data={pieData}
                                outerRadius={120}
                                label
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {
                                    pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w3-col w3-hide l6 s12 w3-responsive w3-margin-bottom">
                    <h4>District Level Officers</h4>
                    <table className="w3-table w3-small w3-table-all">
                        <thead>
                            <tr><th>Name</th>
                                <th>Phone</th>
                                <th>District / LSGI</th>
                                <th>Status</th></tr>
                        </thead>
                        <tbody>
                            {!this.props.localBodies && <EmptyTRMessage colSpan="4"><Spinner /></EmptyTRMessage>
                            }
                            {

                                this.props.localBodies && this.state.list.map(item => {
                                    const dist = this.props.localBodies.find(i => i.name == item.district);
                                    let lb = null;
                                    if (dist && dist.bodies[item.team]) {
                                        lb = dist.bodies[item.team];
                                    }
                                    if (!lb) {
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

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser,
        localBodies: state.LocalBodies
    }
}

export default connect(mapStateToProps, {
    metaMessage,
})(withRouter(DashboardAdmin));