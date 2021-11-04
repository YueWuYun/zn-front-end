//s7vMpqzQfjwm1pd3g8VSCBLY4DeTYAV/5yHDMY07A9ohjlZsG2DsgM5TWbN21Vlo
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp} from 'nc-lightapp-front';

var urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do"
}
let pageCode='1317SUME_form',appid='0001Z010000000002RDJ',formId="supmerge";
class SuppliersumeHeadForm extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            //title:'供应商合并',
            formId:"supmerge"
        },this.props.config);
        this.state = {
            sourceorg:'',
            supplier:''
        }
        this.filterRefer = this.filterRefer.bind(this);
        this.getSourceorg = this.getSourceorg.bind(this);
        this.initTemplate(this.props);
    }
    /**
     * 获取当前选中业务单元pk
     */
    getSourceorg(){
        var me = this;
        return me.state.sourceorg.value;
    }
    /**
     * 加载模板
     */
    initTemplate = (props,callback)=>{
        props.createUIDom(
            {
                pagecode: pageCode//页面id
                //appid: props.config.appid//注册按钮的id
            },
            function (data){
                let meta = data.template;
                //设置元数据
                props.meta.setMeta(meta);
                props.form.setFormStatus(formId,'add');
                callback && callback();
            }
        )
    }
    /**
     * 选择源供应商组织后触发
     * @param props
     * @param moduleId
     * @param key
     * @param value
     */
    afterEventFn(props,moduleId,key,value){
        var me = this;
        if(key == 'pk_org'){
            me.state.sourceorg = value;
            me.setState(this.state);
            props.form.setFormItemsDisabled(formId,{pk_source:false});
            props.form.setFormItemsDisabled(formId,{pk_target:false});
            me.filterRefer(value);
        }
    }
    /**
     * 设置参照过滤条件
     * @param bankDoc
     */
    filterRefer(sourceorg){
        let me = this;
        let meta = me.props.meta.getMeta();
        meta[formId].items.find((item) => item.attrcode == 'pk_source').isShowUnit = false;
        meta[formId].items.find((item) => item.attrcode == 'pk_source').queryCondition = {
            pk_org: sourceorg.value,
            isContainCustomer:false,
            GridRefActionExt:"nccloud.web.uapbd.suppliersume.action.SuppliersumeGridFilterAction"
        };
        meta[formId].items.find((item) => item.attrcode == 'pk_target').isShowUnit = false;
        meta[formId].items.find((item) => item.attrcode == 'pk_target').queryCondition = {
            pk_org: sourceorg.value,
            isContainCustomer:true,
            GridRefActionExt:"nccloud.web.uapbd.suppliersume.action.SuppliersumeGridFilterAction"
        };
        me.props.meta.setMeta(meta);
    }
    render(){
        const {form} = this.props;
        const {createForm} = form;//创建表单，需要引入这个

        return (
            <div class='nc-bill-form-area nc-theme-gray-area-bgc' style={{backgroundColor:"#f6f6f6"}}>
                {createForm(this.config.formId, {
                    onAfterEvent: this.afterEventFn.bind(this)
                })}
            </div>
        );
    }
}
/**
 * 创建页面
 */
export default SuppliersumeHeadForm = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'form',
        pagecode: pageCode,
        headcode: formId
    }
})(SuppliersumeHeadForm);
//s7vMpqzQfjwm1pd3g8VSCBLY4DeTYAV/5yHDMY07A9ohjlZsG2DsgM5TWbN21Vlo