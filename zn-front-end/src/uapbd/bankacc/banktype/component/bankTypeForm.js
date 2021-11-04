//8wSHSRyt7VTZSYaTrp40PMj5lZEyTM8sqlN2lzR1nYf6B4oSsC7uFUKwSipWpVys
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp} from 'nc-lightapp-front';

let pageCode;
class BankTypeForm extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            //title:'银行类别维护界面',
            formId:"banktype",
            type:'add',//标注是新增还是修改
            linkFormId:'auditinfo',
            pageCode:"10140BANK_banktype"
        },this.props.config);
        pageCode = this.config.pageCode;
        this.initData = this.initData.bind(this);
        this.getValue = this.getValue.bind(this);
        this.initTemplate(this.props);
    }

    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props,callback)=>{
        //请求参数
        let requestParam = {
            pagecode:props.config.pageCode
        }
        //请求元数据模板
        ajax({
            url: urls["queryTemplateUrl"],
            data:requestParam,
            //async:false,
            success: (res) =>{
                var meta = res.data;
                //手动处理状态，因setFormStatus有时会出现bug，导致未设置成功
                meta['banktype'].status = 'edit';
                meta['auditinfo'].status = 'edit';
                //设置元数据
                props.meta.setMeta(meta);
                callback && callback();
            }
        });
    }
    /**
     * 组件加载完成后初始化数据
     */
    componentDidMount(){
        this.initData();
    }
    /**
     * 初始化form数据
     */
    initData(){
        var me = this;
        let pk_banktype = this.config.pk_banktype || '';
        let pk_org = this.config.pk_org || '';
        //me.props.form.setFormStatus(me.config.formId, 'edit');
        let requestParam = {
            pk_banktype:pk_banktype,
            pk_org:pk_org,
            pageCode:this.config.pageCode,
            formId:this.config.formId
        };
        ajax({
            url:urls['queryTypeUrl'],
            method:"post",
            data:requestParam,
            success:(res)=>{
                if(res.success){
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        me.props.dealFormulamsg(
                            res.formulamsg,
                            {
                                [me.config.formId]:'form'
                            }
                        );
                    }

                    //设置表单为编辑态
                    me.props.form.setFormStatus(me.config.formId, 'edit');
                    me.props.form.EmptyAllFormValue(me.config.formId);
                    me.props.form.EmptyAllFormValue(me.config.linkFormId);
                    //设置值
                    if(me.config.type === 'edit'){
                        me.props.form.setAllFormValue({[me.config.formId]:res.data[me.config.formId]});
                        //增加结算中心编码控制
                        if(res.data[me.config.formId].rows && res.data[me.config.formId].rows.length>0){
                            if(res.data[me.config.formId].rows[0].values
                                && res.data[me.config.formId].rows[0].values.code.value
                                && res.data[me.config.formId].rows[0].values.code.value == '9999')
                                me.props.form.setFormItemsDisabled(me.config.formId,{code:true});
                            else
                                me.props.form.setFormItemsDisabled(me.config.formId,{code:false});
                        }
                    }

                }else{
                    alert(res.message);
                }
            },
            error: function(res){
                alert(res.message);
            }
        });
    }
    getValue(){
        var me = this;
        return me.props.form.getAllFormValue(me.config.formId);
    }
    render(){
        const {form} = this.props;
        const {createForm} = form;//创建表单，需要引入这个

        return (
            <div>
                <div className="card-area">{createForm(this.config.formId, {})}</div>
            </div>
        );
    }
}
var urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    queryTypeUrl:"/nccloud/uapbd/bankacc/querybanktype.do"
}
/**
 * 创建页面
 */
export default BankTypeForm = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'form',
        pagecode: pageCode,
        headcode: 'banktype'
    }
})(BankTypeForm);
//8wSHSRyt7VTZSYaTrp40PMj5lZEyTM8sqlN2lzR1nYf6B4oSsC7uFUKwSipWpVys