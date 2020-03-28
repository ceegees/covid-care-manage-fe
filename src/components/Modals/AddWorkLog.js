
import  React,{ Component } from 'react'; 
import axios from 'axios'; 
import  Reveal from '../Common/Reveal';
import $ from 'jquery';

export default class AddWorkLog extends Component {

    submitUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const data = $(e.target).serialize();
        axios.post('/api/v1/task/add-worklog',data).then(resp=>{ 
            resp =resp.data;
            this.props.metaMessage(resp.meta);
            if (resp.meta.success){
                this.props.hideModal('reload')
            }
        });
    }

    render() {
        const {request,hideModal,authUser} = this.props;
        return <Reveal modalClass="small-form" onClose={hideModal}>
        <form className="w3-row w3-padding " method="POST" action="/api/v1/task/add-worklog" onSubmit={this.submitUpdate.bind(this)}>
        <div className=" w3-row w3-margin-bottom">
            <div className="w3-col l12">
                <input name="request_id" type="hidden" value={request.id} />
                <label>Message *</label>
                <textarea name="comment" required className="w3-input w3-border"></textarea>
            </div>
            
            <div className="w3-col l12">
                <input name="request_id" type="hidden" value={request.id} />
                <label>Progress (Number of surveys completed of {request.requestSize})  </label>
                <input name="progress" type="number" defaultValue={request.servicedSize} className="w3-input w3-border" />
            </div>
            <div className="w3-col l12">
                <label>Status</label>
                <select name="status" className="w3-select w3-border">
                    <option value="PROGRESS">Progress</option>
                    <option value="COMPLETED">Completed</option>
                    {authUser.role != 'VOLUNTEER' && <option value="CLOSED_VERIFIED">Closed after Verifying Surveys</option>} 
                </select> 
            </div>
        </div>
            <button className="w3-button w3-blue w3-padding-small w3-round w3-right">Submit</button>
        </form>
       </Reveal>
    }

}
 