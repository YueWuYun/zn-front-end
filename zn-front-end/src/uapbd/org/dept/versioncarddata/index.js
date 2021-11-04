//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {base,ajax,createPage } from 'nc-lightapp-front';
const {NCForm,NCInput,NCTable} = base;

let formId = 'dept_v';//卡片组件Id
let pageCode="10100DEPT_dept_v_card";
let appid='0001Z0100000000081E1';


let initTemplate = (props) => {

	props.createUIDom({
		pagecode : pageCode,
		appid : appid
	},
	(data)=>{
		props.meta.setMeta(data.template);
	});

}

class DeptVersionData extends Component {

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

export default DeptVersionData = createPage({
    initTemplate: initTemplate,
})(DeptVersionData)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65