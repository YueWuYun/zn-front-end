import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCForm:BaseNCForm } = base;
let {NCFormItem} = BaseNCForm;
var EMPTY_FN = function(){};
class NCForm  extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let newProps = {
            ...this.props,
            fieldid:this.props.fieldid || "temp"
        };
        return <BaseNCForm {...newProps}/>
    }
}
let itemrender = NCFormItem.prototype.render;
NCFormItem.prototype.render = function(){
    this.props = {
        ...this.props,
        fieldid:this.props.fieldid || this.props.attrcode
    };
    return <span>{itemrender.call(this)}</span>;
}
export default NCForm;