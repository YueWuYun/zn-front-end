//Qadq+6TfVYnVRFjA0221gzl4+k8mSLH8ogLlzrpq7BeRPgUUX9Ktb6GD4bQa1VBU
import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
let { Refer:NCPopRefer} = high;
class Refer extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {attrcode,fieldid,refCode,refName,refType,queryTreeUrl,queryGridUrl} = this.props;
        //取url的最后一个/和.之间的部分
        let urlArr = ((refType == 'tree' || refType == 'gridTree')?queryTreeUrl:queryGridUrl).split("/");
        let urllast = null;
        if(urlArr[urlArr.length-1] && urlArr[urlArr.length-1].split(".").length>1){
            urllast = urlArr[urlArr.length-1].split(".")[0].toLowerCase();
        }
        //取refcode最后的部分
        let refcodelast = null;
        if(refCode && refCode.indexOf(".")>-1){
            let codeArr = refCode.split(".");
            refcodelast = codeArr[codeArr.length-1].toLowerCase();
        }
        let newProps = {
            ...this.props,
            fieldid:attrcode?attrcode: fieldid || urllast || refcodelast || refName
        }

        return <NCPopRefer {...newProps} />
    }
}

export default Refer

//Qadq+6TfVYnVRFjA0221gzl4+k8mSLH8ogLlzrpq7BeRPgUUX9Ktb6GD4bQa1VBU