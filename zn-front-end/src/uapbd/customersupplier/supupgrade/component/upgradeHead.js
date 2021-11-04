//NdJQi6OPT/d1kM6bWm67gaw/OhBgPNaYSZBWhcLR1GV4o5UN/COmZj5hY92u6aI5
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, createButtonApp, getBusinessInfo, promptBox } from 'nc-lightapp-front';
import { BaseUtils } from "../../../public/utils";

var urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    querySupBaseInfoUrl: "/nccloud/uapbd/customersupplier/querysupbaseinfo.do",
    batchUpgradeUrl: '/nccloud/uapbd/customersupplier/batchupgradesup.do'
}
let pageCode = '1317SUUG_supupgrade', appid = '0001Z010000000002950', formId = "supupgrade";
class UpgradeHeadForm extends Component {
    constructor(props) {
        super(props);
        this.config = Object.assign({
            title: '',
            formId: "supupgrade",
            baseFormId: 'supplier_baseInfo',
            bankTableId: 'supbankacc',
            linkTableId: 'suplinkman',
            countryTableId: 'supcountrytaxes',
            appcode: '1317SUUG',
            pageCode: "1317SUUG_supupgrade",
            appid: "0001Z010000000002950"
        }, this.props.config);
        this.state = {
            sourceorg: '',
            supplier: ''
        }
        pageCode = this.config.pageCode;
        appid = this.config.appid;
        this.getValue = this.getValue.bind(this);
        this.filterRefer = this.filterRefer.bind(this);
        this.getSupplierPK = this.getSupplierPK.bind(this);
        this.getSourceorg = this.getSourceorg.bind(this);
        this.initTemplate.call(this, this.props);
    }

    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props, callback) => {
        props.createUIDom(
            {
                pagecode: pageCode,//页面id
                appcode: this.config.appcode
                // appid: appid//注册按钮的id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        // 修正一下单据模板，让源供应商可多选
                        meta[formId].items.find(item => item.attrcode == 'sourcesup').isMultiSelectedEnabled = true
                        props.meta.setMeta(meta);
                        if (props.initData)
                            props.initData(meta.pageid);
                        props.form.setFormStatus(formId, 'add');
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    let businessInfo = getBusinessInfo()
                    this.pk_group = businessInfo.grouupId
                    callback && callback();
                }
            }
        )
        /* //请求参数
         let requestParam = {
             pagecode:pageCode
         }
         //请求元数据模板
         ajax({
             url: urls["queryTemplateUrl"],
             data:requestParam,
             success: (res) =>{
                 var meta = res.data;
                 //设置元数据
                 props.meta.setMeta(meta);
                 props.form.setFormStatus(formId,'add');
             }
         });*/
    }
    /**
     * 组件加载完成后初始化数据
     */
    componentDidMount() {
        //this.props.form.setFormStatus(this.config.formId,'add');
    }
    getValue() {
        var me = this;
        return me.props.form.getAllFormValue(me.config.formId);
    }

    /**
     * 获取源供应商明细数据
     * @returns {string}
     */
    getSupplierPK() {
        var me = this;
        return me.state.getSupplierPK;
    }

    /**
     * 获取当前选中业务单元pk
     */
    getSourceorg() {
        var me = this;
        return me.state.sourceorg.value;
    }
    /**
     * 选择源供应商后触发
     * @param value
     */
    onRefChange(value) {
        if (this.config.onRefChange && BaseUtils.isFunction(this.config.onRefChange)) {
            if (!this.state.sourceorg || this.state.sourceorg.refcode != value.refcode) {
                this.config.onRefChange(value);
            }
        }
        console.log(value)
    }
    /**
     * 选择源供应商组织后触发
     * @param props
     * @param moduleId
     * @param key
     * @param value
     */
    afterEventFn(props, moduleId, key, value) {
        var me = this;
        if (key == 'sourceorg') {
            me.state.sourceorg = value;
            props.form.setFormItemsDisabled(formId, { 'sourcesup': false });
            // 清空源供应商 by zhangchenm
            props.form.setFormItemsValue(formId, { 'sourcesup': null });

            me.setState(this.state);
            me.filterRefer(value);
            this.pk_org = value.value
        }
        //选择源供应商后查询对应明细数据
        if (key == 'sourcesup') {
            let allPks = value.value.split(',')
            if (allPks.length > 1) {
                ajax({
                    url: urls.batchUpgradeUrl,
                    data: { pk_org: this.pk_org, realBatchUpgrade: 'N' },
                    success: resp => {
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.props.config.json['1317SUUG-000040'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                            content: resp.data,             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
                            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                            beSureBtnName: this.props.config.json['1317SUUG-000083'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                            cancelBtnName: this.props.config.json['1317SUUG-000043'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                            beSureBtnClick: () => {
                                this.batchUpgradeSup(allPks)
                            }
                        })
                    }
                })
            }
            else {
                me.config.loadBaseInfo &&
                    props.config.loadBaseInfo(value.value, (finalData) => {
                        props.config.setBaseInfoData(finalData);
                    });
            }
        }
    }

    batchUpgradeSup(pks) {
        ajax({
            url: urls.batchUpgradeUrl,
            data: { pk_org: this.pk_org, realBatchUpgrade: 'Y', update_pks: pks },
            success: resp => {
                this.props.form.setFormItemsValue(formId, { 'sourcesup': { value: '', display: '' } })
                toast({ color: 'success', content: resp.data })
            }
        })
    }
    /**
     * 设置参照过滤条件
     * @param bankDoc
     */
    filterRefer(sourceorg) {
        let me = this;
        let meta = me.props.meta.getMeta();
        meta[formId].items.find((item) => item.attrcode == 'sourcesup').isShowUnit = false;
        meta[formId].items.find((item) => item.attrcode == 'sourcesup').queryCondition = {
            pk_org: sourceorg.value,
            GridRefActionExt: "nccloud.web.uapbd.customersupplier.action.SupupgradeGridFilterAction"
        };
        me.props.meta.setMeta(meta);
    }
    render() {
        const { form, button } = this.props;
        const { createForm } = form;//创建表单，需要引入这个
        let { createButtonApp } = button;

        return (
            <div >
                <div className="nc-bill-extCard">
                    <div className="nc-bill-top-area" style={{ marginBottom: 0, borderBottom: '0px' }}>
                        <div className="nc-bill-form-area">
                            {createForm(this.config.formId, {
                                onAfterEvent: this.afterEventFn.bind(this)
                            })}
                        </div>
                    </div>
                    {/*<label for="source">源供应商</label>
                    {SupplierRef({
                        onChange:this.onRefChange.bind(this),
                        disabled:this.state.sourceOrg ? false : true
                    })}*/}
                </div>
            </div>
        );
    }
}
/**
 * 创建页面
 */
export default UpgradeHeadForm = createPage({
    //initTemplate:initTemplate
    billinfo: {
        billtype: 'form',
        pagecode: pageCode,
        headcode: 'supupgrade'
    }
})(UpgradeHeadForm);
//NdJQi6OPT/d1kM6bWm67gaw/OhBgPNaYSZBWhcLR1GV4o5UN/COmZj5hY92u6aI5