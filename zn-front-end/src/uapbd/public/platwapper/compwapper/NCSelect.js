import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCSelect:BaseNCSelect} = base;
const {NCOption} = BaseNCSelect;
var EMPTY_FN = function(){};
class NCSelect  extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let fieldid = this.props.fieldid || this.props.defaultValue || "common";
        // if(fieldid.indexOf("_select") == -1){
        //     fieldid = fieldid+"_select";
        // }
        let newProps = {
            ...this.props,
            fieldid:fieldid
        }
        return <BaseNCSelect {...newProps}/>
    }
}
NCSelect.NCOption = NCOption;
export default NCSelect;