import React from 'react';

export default class ActionRedirect extends React.Component {
    componentDidMount(){
        if (this.props.action) {
            this.props.action();
        }
        if(this.props.href) {
            document.location.href = "/";
        }
    }
    render() {
        return <div>Loading</div>
    }    
}