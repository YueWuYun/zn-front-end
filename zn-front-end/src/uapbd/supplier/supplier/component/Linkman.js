//qVKR0emRQh6rPu+hvsbXDqbDL02T2nf3zRT4esnz5Dya3Wgdlq+BzT37Sfit4fhT
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,toast} from 'nc-lightapp-front';
import Dialog from './Dialog';
const {NCCheckbox,NCIcon,NCPopconfirm,NCTable,NCRow,NCCol,NCButton,NCAffix,NCAnchor,NCScrollElement,NCScrollLink} = base;
/**
 * liupzhc 联系人 卡片界面
 *
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
        this.props.form.setFormStatus(this.state.formId,'edit');
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
        return(<div>
            {createForm(formId, {
                onAfterEvent: this.onAfterFormEvent.bind(this)
            })}
            </div>)
    }
}




//qVKR0emRQh6rPu+hvsbXDqbDL02T2nf3zRT4esnz5Dya3Wgdlq+BzT37Sfit4fhT