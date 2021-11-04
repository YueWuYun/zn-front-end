//N23ZN2kVlwJkhsnk0bZbGyFYnI20vY4fB+DEVfDoDRI+mhjkXvwqYynslalzL2LW
import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCButton:BaseNCButton} = base;

var EMPTY_FN = function(){};
class NCButton  extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let newProps = {
            ...this.props,
            fieldid:this.props.fieldid || this.props.id || this.props.key ||  'selfopr'
        }
        return <BaseNCButton {...newProps}/>
    }
}
export default NCButton;
//N23ZN2kVlwJkhsnk0bZbGyFYnI20vY4fB+DEVfDoDRI+mhjkXvwqYynslalzL2LW