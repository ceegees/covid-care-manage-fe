import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { hideMessage } from './../../redux/actions.js';

const AppMessage = (props) => {
    const { appMessage } = props; 

    useEffect(() => {
        if(!appMessage){
            return;
        }
        if (appMessage.cls == 'w3-green' && appMessage.stay == 0) {
            setTimeout(props.hideMessage, 3000);
        } else {
            setTimeout(props.hideMessage, appMessage.stay);
        }
    }, appMessage)

    if (!appMessage  || appMessage.text == '') {
        return null;
    }

    return <div className={`${appMessage.cls} app-top-alert`} >
        <button onClick={props.hideMessage}
            className={`w3-display-topright w3-button w3-padding-small`} >&times;
        </button>
        <h5>{appMessage.text}</h5>
    </div>
}

const mapState2Props = (state) => {
    return {
        appMessage: state.appMessage
    }
}
export default connect(mapState2Props, {
    hideMessage
})(AppMessage)