
import React,{ Component } from 'react'; 
import axios from 'axios'; 
import Reveal from '../Common/Reveal';
import $ from 'jquery';


export default class AddUser extends Component {

    submitUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const data = $(e.target).serialize();
        axios.post('/api/v1/manage/create-user',data).then(resp=>{ 
            resp = resp.data;
            this.props.metaMessage(resp.meta);
            if (resp.meta.success){
                this.props.hideModal('reload');
            }
        });
    }

    render() {
        const {body,hideModal} = this.props;
        return <Reveal modalClass="small-form" onClose={e => hideModal() }>
        <form className="w3-row w3-padding" onSubmit={this.submitUpdate.bind(this)} method="POST" action="/api/v1/manage/create-user">
        <div className=" w3-row w3-margin-bottom">
            <div className="w3-col l12">
                <input name="bodyId" type="hidden" value={body.id} />
                <label>Name</label>
                <input name="name" placeholder="" className="w3-input w3-border" />
            </div>
            <div className="w3-col l12">
                <label>Phone Number *</label>
                <input name="phoneNumber" type="number" className="w3-input w3-border" />
            </div> 
        </div>
            <button className="w3-button w3-blue w3-padding-small w3-round w3-right">Submit</button>
        </form>
       </Reveal>
    }

}
 