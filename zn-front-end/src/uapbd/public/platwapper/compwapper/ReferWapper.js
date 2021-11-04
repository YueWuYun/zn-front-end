//U1c0L6JzfGdNc6LwKxFQHJiy+pf9pNN75QyvjSl7CsYBr1mwm7JMjAqgM18OtS1y
import React, { Component } from 'react';
class ReferWapper extends Component{
    constructor(props){
        super(props);
        
    }
    render(){

        let {ReferComp,...others} = this.props;

        let comp = ReferComp && ReferComp();
        if(!comp){
            return null;
        }
        let {attrcode,fieldid,refCode,refName,refType,queryTreeUrl,queryGridUrl} = comp.props;
        //取url的最后一个/和.之间的部分
        let urlArr = ((refType == 'tree' || refType == 'gridTree')?queryTreeUrl:queryGridUrl).split("/");
        let urllast = urlArr[urlArr.length-1].split(".")[0].toLowerCase();
        //取refcode最后的部分
        let refcodelast = null;
        if(refCode && refCode.indexOf(".")>-1){
            let codeArr = refCode.split(".");
            refcodelast = codeArr[codeArr.length-1].toLowerCase();
        }
        let newProps = {
            ...others,
            fieldid:attrcode?attrcode: fieldid || urllast || refcodelast || refName
        }

        return <ReferComp {...newProps} />
    }
}

export default ReferWapper

//U1c0L6JzfGdNc6LwKxFQHJiy+pf9pNN75QyvjSl7CsYBr1mwm7JMjAqgM18OtS1y