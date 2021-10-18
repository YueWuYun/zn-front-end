/*FDNWFGhCqsK5jzLdZq9ANnQiRS81hErlJLFY+OLMRsZSVVmQp0efFChDSJWZPdNp*/
import { ajax, viewModel,toast } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { formRateEditinfo } from "../events/judgeCurrtype.js";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * [外币兑换]-卡片加载数据
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const loadQueryData = function () {

    let scene=this.props.getUrlParam('scene');
    //查询单据详情
    if (this.props.getUrlParam('status') === 'edit' ||
        this.props.getUrlParam('status') === 'browse') {
        if (this.props.getUrlParam('id') &&
            this.props.getUrlParam('id').length > 0) {
            let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
            ajax({
                url: '/nccloud/cmp/recbill/recbillquerycard.do',
                data: data,
                success: (res) => {
                    if (res.data) {
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            //页签赋值
                            let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                            let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                            setSourceFlag.call(this, source_flag);
                            //按钮显示控制[单据状态]
                            this.props.setUrlParam({
                                billno: res.data.head[this.formId].rows[0].values.bill_status.value
                            });
                            this.billno = billno;
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        }
                        if(scene){
                            this.linkToggleShow
                        }else{
                            this.toggleShow();//切换页面状态,
                        }
                      
                    } else {
                        //清空数据
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }

                    if (this.props.getUrlParam('status') === 'edit') {
                        //设置组织不可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org_v': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_fiorg': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_fiorg_v': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_pcorg_v': true });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_pcorg': true });
                    }
                },
            });
        }

    }
    //复制
    if (this.props.getUrlParam('status') === 'copy') {
        // /清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
        ajax({
            url: '/nccloud/cmp/recbill/recbillcopy.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        setSourceFlag.call(this, source_flag);//翻译来源系统
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);

                    }
                    this.billno = '';
                    this.toggleShow();//切换页面状态,
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
                //设置组织不可以编辑
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
            }
        });
    }
    //新增--->需要添加交易类型
    if (this.props.getUrlParam('status') === 'add') {
        // /清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        //清空table所有数据
        this.props.cardTable.setTableData(this.tableId, { rows: [] });
        //处理session数据
        let tradetype = getGlobalStorage('sessionStorage', 'sessionTP');
        let tradename = getGlobalStorage('sessionStorage', 'sessionName');
        let tradepk = getGlobalStorage('sessionStorage', 'sessionpk');

        //1-新增之前设置默认值，保证后台能够获取到
        if(this.state.curr_pk_org){
            //默认值设置财务组织
            this.props.form.setFormItemsValue(this.formId,
                {
                    'pk_org': {
                        value: this.state.curr_pk_org,
                        display: this.state.curr_orgname
                    },
                    'pk_org_v': {
                        value: this.state.curr_pk_org_v,
                        display: this.state.curr_orgname_v
                    }
                }
            );
        }
        //默认值：收款交易类型
        if (tradetype && tradetype.length > 0) {
            //不规范财务组织处理
            let fdStart = tradetype.indexOf("D5");
            let fdStartf = tradetype.indexOf("F5");
            if (fdStart == 0 || fdStartf == 0) {
                tradetype = '';
                tradename = '';
                tradepk = '';
            }
        }
        if (tradetype && tradetype.length > 0) {
            this.props.form.setFormItemsValue(this.formId, { 'trade_type': { display: tradename, value: tradetype } });
        }
        if (tradepk && tradepk.length > 0) {
            this.props.form.setFormItemsValue(this.formId, { 'pk_tradetypeid': { display: tradename, value: tradepk } });
        }
        //改造：防止模版设置默认值后卡片显示不出来
        let addCardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

        console.log('transtype:', getGlobalStorage('sessionStorage', 'sessionTP'));
        console.log('transtype_name:', getGlobalStorage('sessionStorage', 'sessionName'));
        console.log('pk_transtype:', getGlobalStorage('sessionStorage', 'sessionpk'));
        
        ajax({
            url: '/nccloud/cmp/recbill/recbilladdevent.do',
            data: addCardData,
            success: (res) => {
                if (res.data) {
                    let isContainBoay = false;//是否包含表体显示[有组织显示，没有组织不显示]
                    if (res.data.head) {
                        //设置组织可以编辑
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
                        this.props.form.setFormItemsVisible(this.formId, { 'pk_org_v': false });
                        if (this.state.curr_pk_org) {
                            //是否包含预置财务组织
                            isContainBoay = true;
                            this.props.resMetaAfterPkorgEdit();
                            //财务组织赋值
                            this.props.form.setFormItemsValue(this.formId,
                                {
                                    'pk_org': {
                                        value: this.state.curr_pk_org,
                                        display: this.state.curr_orgname
                                    },
                                    'pk_org_v': {
                                        value: this.state.curr_pk_org_v,
                                        display: this.state.curr_orgname_v
                                    }
                                }
                            );
                        } else {
                            //没有预设组织
                            this.props.resMetaAfterPkorgEdit();
                            this.props.initMetaByPkorg();
                        }
                        /**
                         * 卡片-收款交易类型设置
                         */
                        if (tradetype && tradetype.length > 0) {
                            this.props.form.setFormItemsValue(this.formId, { 'trade_type': { display: tradename, value: tradetype } });
                        }
                        if (tradepk && tradepk.length > 0) {
                            this.props.form.setFormItemsValue(this.formId, { 'pk_tradetypeid': { display: tradename, value: tradepk } });
                        }
                        //来源系统翻译
                        let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        setSourceFlag.call(this, source_Flag);//来源系统翻译
                    }
                    if (res.data.body && isContainBoay) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                    formRateEditinfo.call(this, res.data.userjson);//汇率编辑性控制
                    this.billno = '';
                    this.toggleShow();//切换页面状态,
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
            }
        });
    }
}

/*FDNWFGhCqsK5jzLdZq9ANnQiRS81hErlJLFY+OLMRsZSVVmQp0efFChDSJWZPdNp*/