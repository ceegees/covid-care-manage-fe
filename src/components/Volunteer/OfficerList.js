import  React,{ Component } from 'react'; 
import axios from 'axios';
import { Spinner,Message} from '../Common/Helper';     

export default class OfficerList extends Component{
    constructor(arg){
        super(arg);
        this.state = {
            list:null
        }
    }
    
    reloadData(){
        axios.get(`/api/v1/manage/lb-officers?lbid=${this.props.localBody.id}`).then(resp=>{
            this.setState({
                list:resp.data.data
            });
        })
    }

    componentDidMount(){
        this.reloadData();
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.version != this.props.version){
            this.reloadData();
        }
    }

    render(){
        const {list} = this.state;
        return <div className="w3-row">
           {!list  && <Spinner/>}
           {list && list.length == 0 && <Message>Officers are not added to this LSGI</Message>}
           <table className="w3-table w3-table-all">
               <thead> 
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Wards Assigned
                        </th>
                    </tr> 
               </thead>
               <tbody>
                {list && list.map(item=> {
                    return <tr key={item.id}>
                    <td>
                        {item.name}<br/>
                        {item.phoneNumber} <br/> 
                        <table className="w3-small w3-table w3-table-all w3-margin-top">
                            <thead>
                                <tr>
                                    <th>Volunteer Name</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>{
                            item.reportees.map(user => {
                                return <tr key={user.phoneNumber} ><td>{user.name}</td><td>{user.phoneNumber}</td></tr>
                            })
                        } 
                        </tbody></table>
                    </td>
                    <td className="w3-small w3-list">
                        <ol className="w3-smaltl w3-list">
                            {item.userRoles.map(role => {
                                return <li key={`role_${role.id}`}>{role.localBody.name} :{role.role}</li>
                            })}
                        </ol>
                    </td>
                </tr>
                })}
            </tbody>
           </table>
        </div>
    }
}