//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base} from 'nc-lightapp-front';
class ForgCheck extends Component{
    constructor(props){
        super(props);
        this.onOrgChange = this.props.onOrgChange
    }
    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{}
    render() {
        let {form} = this.props;
        let { createForm } = form;
        return (
            <div className="nc-bill-form-area">
                {createForm('controlorg', {
                    onAfterEvent: this.afterEvent.bind(this)
                })}
            </div>
        )
    }
}
export default  ForgCheck;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65