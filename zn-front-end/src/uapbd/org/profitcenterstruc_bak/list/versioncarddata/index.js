//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {base,createPage } from 'nc-lightapp-front';
const {} = base;

let formId = 'pfc_v_card';//卡片组件Id
let pageCode="10100PFC_v_card";


let initTemplate = (props) => {

	props.createUIDom({
		pagecode : pageCode,
	},
	(data)=>{
		props.meta.setMeta(data.template);
	});

}

class VersionData extends Component {

    componentDidMount(){
        this.props.form.setAllFormValue({[formId]:this.props.config[formId]});
    }

    render(){

        let {form} = this.props;

        const {createForm}=form;

        return (
            <div className="card-area">
                {createForm(formId, {},true) }
            </div> 

        )
    }

}

export default VersionData = createPage({
    initTemplate: initTemplate,
})(VersionData)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65