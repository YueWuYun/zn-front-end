//qVKR0emRQh6rPu+hvsbXDqbDL02T2nf3zRT4esnz5Dya3Wgdlq+BzT37Sfit4fhT
import React, { Component } from 'react';
import {base} from 'nc-lightapp-front';
/**
 * liupzhc 联系人 卡片界面
 *  
 *  props:{
 *      form:this.props.form,
 *      formId:your linkman form id,
 *  }
 */
export default class Linkman extends Component{
    constructor(props){
        super(props);
        this.state = {
            ...this.props
        }
    }

    /**
     * 联系人 弹出来就默认可以编辑
     */
    componentDidMount(){
        let status = this.props.formStatus ? this.props.formStatus : 'edit'
        this.props.form.setFormStatus(this.state.formId, status);
    }
    componentWillReceiveProps(newProps){
        this.state = {
            ...newProps
        }
    }
    /**
     * 弹出框表单编辑后事件
     */
    onAfterFormEvent(){

    }
    
    render(){
        let { form ,formId} = this.state;
        let {createForm} = form;
        return(<div id='portalContainter09'>
            {createForm(formId, {
                onAfterEvent: this.onAfterFormEvent.bind(this)
            })}
            </div>)
    }
}




//qVKR0emRQh6rPu+hvsbXDqbDL02T2nf3zRT4esnz5Dya3Wgdlq+BzT37Sfit4fhT