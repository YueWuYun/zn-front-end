//hsdWL8Lo5PBs6ABCdvH88+Cw3UnkZm9joO0iIkvtWQYGde0MvnFgyQ/7yEHAiQo+
import React,{Component} from 'react';
import {base,ajax,toast,promptBox} from 'nc-lightapp-front';
const{NCMessage} = base;
class SupplierClassForm extends Component{
    constructor(props){
        super(props);
        this.lang = props.lang;
        this.state = {
            ...this.props,
        }
    }
    /**
     * state更新 重置
     * @param newProps
     */
    componentWillReceiveProps(newProps){
        this.state = {
            ...newProps
        }
        this.setState(this.state);
    }
    /**
     * 编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index){
        debugger
        switch(key){
            case "enablestate":
                if(!this.state.curSelectedNode){
                    let content = value.value?this.lang['10140SCL-000000']:this.lang['10140SCL-000001'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    NCMessage.create({content: content, color: 'warning'});//默认top
                    return;
                }
                let requestParam = {
                    primaryKey:this.state.curSelectedNode.refpk,
                    enablestate:value.value?'2':'1',
                    pk_curOrg:this.state.curOrg.refpk,
                    ts:this.state.curSelectedNode.nodeData.ts,
                    nodeType:this.state.nodeType
                };
                this.enablestatePrompt(props,value,requestParam,this.state.curSelectedNode,this.checkParentIsStop);
                break;
            default:
                break;
        }
    }

    /**
     * 编辑前事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param data
     * @returns {boolean}
     */
    onBeforeFormEvent = (props, moduleId, key, value,data)=>{
        if(this.state.isAdd){
            return true;
        }
        let me = this;
        return this.checkCurNodeEnableStateAuth(me.state.curSelectedNode);
    }
    /**
     * 检查上级是否有停用数据 有：return true
     * @param props
     * @param selectedNode
     * @returns {boolean}
     */
    checkParentIsStop = (props,selectedNode)=>{
        let fathid = selectedNode.pid;
        if(fathid === '~'){
            return false;
        }
        let parentNode = props.syncTree.getSyncTreeValue(this.state.treeId,selectedNode.pid);
        if(parentNode && !parentNode.nodeData.enablestate){
            return !parentNode.nodeData.enablestate;
        }else{
            this.checkParentIsStop(props,parentNode);
        }
    }
    checkCurNodeEnableStateAuth = (node)=>{
        if(node.refpk == 'root' || node.refpk == '~'){
            return true;
        }
        if(!node.nodeData.isGlobeData && this.props.nodeType == 'GLOBE_NODE'){
            toast({content:this.lang['10140SCL-000002'],color:'warning'});/* 国际化处理： 全局只能维护全局的数据！*/
            return false;
        }else if(!node.nodeData.isGroupData && this.props.nodeType == 'GROUP_NODE'){
            toast({content:this.lang['10140SCL-000003'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
            return false;
        }else if(!node.nodeData.isOrgData && this.props.nodeType == 'ORG_NODE'){
            toast({content:this.lang['10140SCL-000004'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
            return false;
        }
        return true;
    }
    /**
     * 停启用 弹出提示
     * @param props
     * @param value
     * @param requestParam
     * @param callback
     */
    enablestatePrompt = (props,value,requestParam,selectedNode,callback)=>{

        if(value.value && callback && callback(props,selectedNode)){
            toast({content:this.lang['10140SCL-000005'],color:'warning'});/* 国际化处理： 选中的供应商分类存在停用的上级, 不能启用！*/
            props.form.setFormItemsValue(this.props.formId,{enablestate:{value:!value.value,display:!value.value}});
            return;
        }
        let stopMsg = this.lang['10140SCL-000006'];/* 国际化处理： 您确定要停用所选数据及其所有下级数据吗?*/
        let enableMsg = this.lang['10140SCL-000007'];/* 国际化处理： 是否确认要启用？*/
        promptBox({
            color:"warning",
            title:this.lang['10140SCL-000008'],/* 国际化处理： 提示*/
            content:value.value?enableMsg:stopMsg,
            beSureBtnClick:()=>{
                ajax({
                    url:this.state.enablestateUrl,
                    data:requestParam,
                    success:(result)=>{
                        debugger
                        // !value.value ? props.syncTree.delNodeSuceess(this.state.treeId,this.state.curSelectedNode.refpk):null;
                        /****
                         * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                         * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                         */
                        toast({title:value.value?this.lang['10140SCL-000009']:this.lang['10140SCL-000010'],color:'success'});/* 国际化处理： 启用成功！,停用成功！*/
                        // 刷新一下树数据，避免检测上级节点停启用时与后台数据不符
                        this.props.updateTree();
                    }
                });
            },
            cancelBtnClick:()=>{
                props.form.setFormItemsValue(this.props.formId,{enablestate:{value:!value.value,display:!value.value}});
                return;
            }
        });
    }
    /**
     * 清空表单数据
     * @param formId
     */
    clearFormData(formId){
        this.props.form.EmptyAllFormValue(formId);
        this.props.form.setFormItemsDisabled(formId,{enablestate:true});
    }
    /**
     * 设置表单数据
     * @param data
     */
    setFormData(data){
        this.props.form.setAllFormValue(data);
    }
    /**
     * 获得表单数据
     * @param formId
     * @returns {*}
     */
    getFormData(formId){
        return this.props.form.getAllFormValue(formId);
    }
    /**
     * 设置表单项状态
     * @param formId
     * @param obj
     */
    setFormItemStatus(formId,obj){
        this.props.form.setFormItemsDisabled(formId,obj);
    }
    render(){
        const {form,ncmodal} = this.state;
        const {createForm} = form;
        const{createModal} = ncmodal;
        return (
            <div>
                {createForm(this.state.formId,{cancelPSwitch:true,onAfterEvent: this.onAfterFormEvent.bind(this),onBeforeEvent:this.onBeforeFormEvent})}
                {createModal('formModal',{noFooter:false})}
            </div>
        )
    }
}
export default SupplierClassForm
//hsdWL8Lo5PBs6ABCdvH88+Cw3UnkZm9joO0iIkvtWQYGde0MvnFgyQ/7yEHAiQo+