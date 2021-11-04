//RkL3PMjryLlyizQTqDNHebsCJuofMy70D8jiphGMMVaWQacLFYi75zQQgiwmsIyF
import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCFormControl:BaseNCFormControl} = base;

var EMPTY_FN = function(){};
class NCFormControl  extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let {fieldid,type,key,placeholder} = this.props;
        let newProps = {
            ...this.props,
            fieldid: fieldid ||  type || key || placeholder ||'ncformcontrol'
        }
        return <BaseNCFormControl {...newProps}/>
    }
}
export default NCFormControl;
//RkL3PMjryLlyizQTqDNHebsCJuofMy70D8jiphGMMVaWQacLFYi75zQQgiwmsIyF