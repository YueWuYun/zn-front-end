//++7w43DCCjLUO++hI+mJmJhpEvcm2696rADttjETlpLVYa4lxxKDogqHB+7UyKOE
import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCIcon:BaseNCIcon } = base;

var EMPTY_FN = function(){};
class NCIcon  extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let newProps = {
            ...this.props,
            fieldid:this.props.fieldid || this.props.type
        };
        return <BaseNCIcon {...newProps}/>
    }
}
export default NCIcon;
//++7w43DCCjLUO++hI+mJmJhpEvcm2696rADttjETlpLVYa4lxxKDogqHB+7UyKOE