import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Reveal from '../Common/Reveal';
import { Spinner, EmptyTRMessage } from '../Common/Helper';
export default class WorkLog extends Component {
    constructor(args) {
        super(args);
        this.state = {
            data: null
        }
    }
    componentDidMount() {
        axios.get(`/api/v1/task/work-logs?id=${this.props.id}`).then(res => {
            this.setState({
                data: res.data.data
            });
        })
    }

    render() {
        return <Reveal onClose={this.props.hideModal.bind(this)}>
            <div className="w3-padding">
                <h4 className="w3-center w3-margin-top">Work Log</h4>
                <div className="">
                    {this.state.data && this.state.data.map(item => {
                        return <div className="w3-border-bottom w3-section" style={{ whiteSpace: 'pre-wrap' }}>
                            {item.comments}<br />
                            <div className="w3-bar">
                                <span className="w3-tiny w3-text-grey w3-left">
                                    by {`${item.actor.name} | ${item.actor.phoneNumber}`}
                                </span>
                                <span className="w3-small w3-text-grey w3-right">
                                    {moment(item.createdAt).fromNow()}
                                </span>
                            </div>
                        </div>
                    })}
                    {!this.state.data && <Spinner />}
                    {this.state.data && this.state.data.length == 0 &&
                        <div className="w3-padding" >
                            There are no updates on the work log.
                    </div>}
                </div>
            </div>
        </Reveal>
    }
}