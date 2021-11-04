//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print} from 'nc-lightapp-front';
let { NCMessage:Message,NCCol:Col,NCRow:Row,NCDropdown:Dropdown,NCMenu:Menu,NCButton:Button,NCCheckbox:Checkbox,NCTooltip:Tooltip } = base;
const {NCMenu,NCDropdown,NCCheckbox,NCPopconfirm} = base;
const {NCMenuGroup} = NCMenu;
const { Item } = Menu;

/****************默认参数  开始***********************/
let formId = 'setofbook';//卡片组件Id
let appcode='10100SOB';
let pageCode="10100SOB_sobcard";
const billType = 'setofbook';
const urls = {
	sobquery:'/nccloud/uapbd/setofbook/sobquery.do',
	save : '/nccloud/uapbd/setofbook/save.do',
	query : '/nccloud/uapbd/setofbook/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

class SOBCard extends Component { 

    constructor(props) {
        super(props);
        this.loadMeta(()=>{
            let model={
                areaType: 'form',
                areacode: formId,
                rows:{
                    0:{values:this.props.config.selectData}
                }    
            }
            //如果是新增，则清空表单数据
            if(this.props.config.toFormStatus!='add'){
                this.props.form.setAllFormValue({[formId]:model});
                this.props.form.setFormItemsDisabled(formId,{'pk_accsystem':false});
            }else{
                //若是新增，科目体系不可编辑
                this.props.form.setFormStatus(formId, 'add');
                this.props.form.EmptyAllFormValue(formId)
                this.props.form.setFormItemsDisabled(formId,{'pk_accsystem':true});
            }
        });
    }

    loadMeta(initPage){
        let prop=this.props;
        prop.createUIDom(
            {
                pagecode: pageCode
            },
            (data) => {
                if(data){
                    if(data.template){
                        let meta = data.template;
                        //根据第一次加载账簿类型卡片界面的状态判断字段联动情况
                        prop.modifierFormMeta(meta,prop.config.selectData,prop.config.toFormStatus);
    
                        //暂时设置财务核算账簿为必输项
                        let isaccountbook = meta[formId].items.find(item => item.attrcode === 'isaccountbook');
                        isaccountbook.required=true;
    
                        prop.meta.setMeta(meta,()=>{
                            prop.form.setFormStatus(formId,prop.config.toFormStatus);
                        });

                        initPage();
                    }
                }
            }
        )
    }

    componentDidUpdate(){
        if(this.props.formCurrState === 'edit'||this.props.formCurrState === 'add'){
			window.onbeforeunload=()=>{
				return '';
			}
		}else{
			window.onbeforeunload=null;
		}
    }
    
    //表格编辑前事件
	onBeforeEvent(props,moduleId,key,value,index){
        if(key=='pk_checkelemsystem'){
            let isliabilitybook = index['isliabilitybook'];
            let meta = props.meta.getMeta();
            if(isliabilitybook && isliabilitybook.value==true){
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = true;
                        this.props.form.setFormItemsValue(formId,item);
                    }
                });
            }else{
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = false;
                        this.props.form.setFormItemsValue(formId,item);
                    }
                });
            }
        }
        return true;
    }

    //form表单编辑后事件
    onAfterFormEvent(props,moduleId,key,value,oldValue){
        if(key=='isaccountbook'||key=='pk_accperiodscheme'){
            let meta=this.props.meta.getMeta();
            let isaccountbook=this.props.form.getFormItemsValue(moduleId,'isaccountbook');
            let pk_accperiodscheme=this.props.form.getFormItemsValue(moduleId,'pk_accperiodscheme');
            if(!isaccountbook||!isaccountbook.value||!pk_accperiodscheme||!pk_accperiodscheme.value){
                meta[formId].items.map((item)=>{
                    if(item.attrcode=="pk_accsystem"){
                        item.required=false;
                        this.props.form.setFormItemsDisabled(moduleId,{'pk_accsystem':true});
                        this.props.form.setFormItemsValue(moduleId,{'pk_accsystem':{}});
                    }
                });
            }else{
                meta[formId].items.map((item)=>{
                    if(item.attrcode=="pk_accsystem"){
                        item.required=true;
                        this.props.form.setFormItemsDisabled(moduleId,{'pk_accsystem':false});
                        this.props.form.setFormItemsValue(moduleId,item);
                    }
                });
            }
            //勾选财务核算账簿不允许勾选责任核算账簿
            let isaccount = props.form.getFormItemsValue('setofbook','isaccountbook');
            if(isaccount.value){
                props.form.setFormItemsValue(moduleId,{'isliabilitybook':{value:false,display:'否'}});
            }


        }else if(key=='isliabilitybook'){
            let meta = props.meta.getMeta();
            if(value && value.value==true){
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = true;
                        this.props.form.setFormItemsValue(moduleId,item);
                    }
                });
            }else{
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = false;
                        this.props.form.setFormItemsValue(moduleId,item);
                    }
                });
            }
        }
        //勾选责任核算账簿不允许勾选财务核算账簿
        let isliability = props.form.getFormItemsValue('setofbook','isliabilitybook');
        if(isliability.value){
            props.form.setFormItemsValue('setofbook',{'isaccountbook':{value:false,display:'否'}});
        }
    }

    render(){
        const {form,button} = this.props;
        const {createForm}=form;
        const {createButton}=button;
        return(
            <div className="nc-bill-form-area">
                {createForm(formId, {
                        onAfterEvent: this.onAfterFormEvent.bind(this),
                        onBeforeEvent: this.onBeforeEvent.bind(this)
                })}              
            </div>
        )
    }
}



/**
 * 创建页面
 */
export default SOBCard = createPage({
    billinfo:{
        billtype:'form',
        pagecode:pageCode,
        headcode:formId
    },
    initTemplate: ()=>{},
})(SOBCard)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65