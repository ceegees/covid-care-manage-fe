/*global google*/ 
import React, {Component} from 'react';  

export class Message extends Component {
    render(){
        return <div className="w3-padding">
            {this.props.children}
        </div>
    }
}
export class ErrorHelperText extends Component {
    static get defaultProps() {
        return {
            errors: null
        };
    }
    render() {
        let errorContent = null;
        if (!this.props.errors) {
            return <span />;
        }
        if (typeof (this.props.errors) === 'string') {
            errorContent = (<div className="w3-text-red">* {this.props.errors}</div>);
        } else {
            errorContent = (<div className="w3-text-red">* {this.props.errors.join(',')}</div>);
        }
        return errorContent;
    }
}

export const EmptyTRMessage = ({colSpan,children})=>{
    return <tr><td className="w3-center w3-text-grey" colSpan={colSpan}>{children}</td></tr>
}
export const Spinner = (props = {message:'Loading Data', mode:'big' }) => { 
    let  paddingCls = 'w3-padding-64';
    if (props.mode == 'small'){
        paddingCls='w3-padding-small cgs-loader-small';
    }
    return <div className={`w3-center ${paddingCls} w3-block`} > 
        <div className="w3-center w3-padding">
        <div className="cgs-loader"></div>
        </div>
       {props.message}
    </div>
}


export class FormTextField extends Component {
    static get defaultProps() {
        return {
            type: "text",
            valueChange: null,
            inputClass: '',
            textClass: '',
            onBlur: function () {}
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value: null
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() { 
        let {inputClass}   = this.state;
        if (this.state.value === null || this.state.value === undefined) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }
        if (this.props.inputClass != undefined) {
            inputClass = this.props.inputClass;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        return (
            <div className="kf-input-padding">
                <label className="w3-text-black">{this.props.label} {mandatoryField} </label>
                <input
                    className={this.props.textClass}
                    type={this.props.type}
                    id={this.props.id}
                    autoComplete={this.props.name}
                    name={this.props.name}
                    pattern={this.props.pattern}
                    defaultValue={this.props.defaultVal}
                    required={this.props.isMandatory}
                    onBlur={this.props.onBlur}
                    value={this.state.value ? this.state.value : ""}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder || this.props.label}
                    className={`${this.props.inputClass} ${errorClass}`}
                />
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class FormTextarea extends Component {
    static get defaultProps() {
        return {
            valueChange: null
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value:null
        }
    }
  

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }

        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }

        return (
            <div className = "kf-input-padding">
                <label>{this.props.label} {mandatoryField}</label>
                <textarea className="fm-text-input" id={this.props.id}
                    name={this.props.name}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder ? this.props.placeholder: this.props.label}
                    value={this.state.value  ? this.state.value :''}
                    className={`${this.props.inputClass} ${errorClass}`}/>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}


export class SelectField extends Component {


    constructor(args) {
        super(args);
        this.state = {
            value: null,
        }
    }

    static get defaultProps() {
        return {
            valueChange: null, 
            options: [],  
        };
    }
    
    componentDidMount() {
        this.setState({
            value: this.props.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.valueChange) {
        //     nextProps.valueChange(nextProps.name, nextProps.defaultValue);
        // }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.props.valueChange(this.props.name, this.props.defaultValue);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        } 

        return (
            <div  className="kf-input-padding" >
                <label className="w3-text-black">{this.props.label} {mandatoryField}</label>
                <select id={this.props.id}
                    name={this.props.name}
                    defaultValue={this.props.defaultValue}
                    value={this.state.value ? this.state.value : ''}
                    className={this.props.selectClass + " " + errorClass}
                    placeholder={this.props.label} 
                    onChange = {this.onChange.bind(this)}> 
                    {this.props.children}
                </select>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class GooglePlacesAutoComplete extends Component {
    constructor(args){
        super(args);
        this.locationInput = React.createRef();
    }

    componentDidMount(){
        var input = document.getElementById('map_location');
        var autocomplete = new google.maps.places.Autocomplete(input);  
        autocomplete.addListener('place_changed', () => {
            var place = autocomplete.getPlace();
            if (this.props.onPlaceChange) {
                this.props.onPlaceChange(place)
            }
        });
    }
 
    render() {
        return (
            <div id="autocomplete-container">
                <input id="map_location" type="text"
                    label="Album/Event Location"
                    className = "w3-input w3-border"
                    placeholder= {this.props.placeholder} 
                    autoComplete="on"
                    ref={this.locationInput}
                />
            </div>
        )
    }
}