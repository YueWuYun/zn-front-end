/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print } from 'nc-lightapp-front';
let { NCMessage } = base;
import { formId, tableId, table_orgs, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06 } from '../constants';
import { busiOperate } from './busiOperate';
import { printClick } from './printClick';
import { queryBills } from './queryBills';
import { dialogDefaultData } from './dialogDefaultData';
import { getGenerateData } from './getGenerateData';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
export default function (props, id) {
    let pks = [];
    let data;
    if (id == 'confirmgenerate_01' || id == 'confirmgenerate_02' || id == 'confirmgenerate_03' || id == 'confirmgenerate_04' || id == 'confirmgenerate_05') {
        id = 'confirmgenerate';
    }
    if (id == 'combine_01' || id == 'combine_02' || id == 'combine_03') {
        id = 'combine';
    }
    let url;
    switch (id) {
        //【card_head】【刷新】
        case 'refresh':
            this.getdata();
            break;
        //【card_head】【生单】
        case 'Generate':
            let generateData = props.table.getCheckedRows(tableId);
            if (generateData.length == 0) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                return;
            }
            else {
                let pk_org = generateData[0].data.values.pk_org.value;
                let pk_group = generateData[0].data.values.pk_group.value;
                let pk = generateData[0].data.values.pk_informerrelease.value;
                let remark = generateData[0].data.values.memo;//摘要
                let pk_fundplanitem = generateData[0].data.values.recpay_fundplansubj;//收/付款资金组织计划项目
                let pk_financeplanitem =generateData[0].data.values.recpay_orgplansubj;//收/付款单位计划项目
                let pk_FundType = generateData[0].data.values.pk_fundtype;//货币形态
                let balatype = generateData[0].data.values.pk_balatype;//结算方式
                props.form.EmptyAllFormValue(formId_01);
                props.form.setFormStatus(formId_01, "edit");
                props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'card_head' } });
                props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org } });
                props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group } });
                props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
                //摘要
                props.form.setFormItemsValue(formId_01, { 'remark': remark });
                //收/付款资金组织计划项目
                props.form.setFormItemsValue(formId_01, { 'pk_fundplanitem': pk_fundplanitem });
                //收/付款单位计划项目
                props.form.setFormItemsValue(formId_01, { 'pk_financeplanitem': pk_financeplanitem });
                //货币形态
                props.form.setFormItemsValue(formId_01, { 'pk_FundType': pk_FundType });
                //结算方式
                props.form.setFormItemsValue(formId_01, { 'balatype': balatype });
                this.open_generate();
            }
            break;
        //【弹窗】【生单】【确认】
        case 'confirmgenerate':
            let tempData = this.formTempData;
            props.form.setAllFormValue({ [formId_01]: tempData });
            let index = props.form.getFormItemsValue(formId_01, 'index').value;
            console.log(props.form.getAllFormValue(formId_01));
            data = getGenerateData(props);
            if (data == undefined) {
                return;
            }
            data.geneinfo.IsCombine = 'N';
            ajax({
                url: '/nccloud/cmp/informer/cardgenerate.do',
                data,
                success: (res) => {
                    refresh(this, props, res, index);
                    this.close_generate();
                    this.close_capital_01();
                    this.close_capital_02();
                    this.close_finance_01();
                    this.close_finance_02();
                    this.close_finance_03();
                }
            });
            break;
        //【弹窗】【选择生成资金单据，还是财务单据】【下一步】
        case 'generatenext':
            console.log(props.form.getAllFormValue(formId_01));
            this.close_generate();
            let generateSelected = this.state.selectedGenerateValue;
            if (generateSelected == "capital") {
                this.open_capital();
            }
            if (generateSelected == "finance") {
                this.open_finance();
            }
            break;
        //【弹窗】【生成资金单据】【下一步】
        case 'capitalnext':
            console.log(props.form.getAllFormValue(formId_01));
            this.close_capital();
            let capitalselected = this.state.selectedCapitalValue;
            let tableData;
            let pk_fundorg;

             //摘要
            let remark = props.form.getFormItemsValue(formId_01, 'remark');
             //收/付款资金组织计划项目
            let pk_fundplanitem =  props.form.getFormItemsValue(formId_01, 'pk_fundplanitem');
             //收/付款单位计划项目
            let pk_financeplanitem = props.form.getFormItemsValue(formId_01, 'pk_financeplanitem');
             //货币形态
            let pk_FundType =  props.form.getFormItemsValue(formId_01, 'pk_FundType');
             //结算方式
            let  balatype = props.form.getFormItemsValue(formId_01, 'balatype');
             
            //委托收款，委托付款
            if (capitalselected == "36J7" || capitalselected == "36J5") {
                this.props.form.EmptyAllFormValue(formId_02);
                this.props.form.setFormStatus(formId_02, "edit");
                //收、付资金组织设置默认值
                pk_fundorg = props.form.getFormItemsValue(formId, 'pk_org')
                this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: capitalselected } });
                         
                //补全委托收付相应信息
                this.props.form.setFormItemsValue(formId_02, { 'pk_FundOrg': pk_fundorg });
                this.props.form.setFormItemsValue(formId_02, { 'remark': remark });
                this.props.form.setFormItemsValue(formId_02, { 'pk_fundplanitem': pk_fundplanitem });
                this.props.form.setFormItemsValue(formId_02, { 'pk_financeplanitem': pk_financeplanitem });
                this.props.form.setFormItemsValue(formId_02, { 'pk_FundType': pk_FundType });
                this.props.form.setFormItemsValue(formId_02, { 'balatype': balatype });

                console.log(props.form.getAllFormValue(formId_01));
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_capital_01();
            }
            //资金上收，资金下拨
            if (capitalselected == "36K4" || capitalselected == "36K2") {
                this.props.form.EmptyAllFormValue(formId_03);
                this.props.form.setFormStatus(formId_03, "edit");
                this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: capitalselected } });
                console.log(props.form.getAllFormValue(formId_01));
                //补全资金上收，资金下拨相应信息
                this.props.form.setFormItemsValue(formId_03, { 'remark': remark });
                this.props.form.setFormItemsValue(formId_03, { 'pk_fundplanitem': pk_fundplanitem });
                this.props.form.setFormItemsValue(formId_03, { 'pk_financeplanitem': pk_financeplanitem });
                this.props.form.setFormItemsValue(formId_03, { 'pk_FundType': pk_FundType });
                this.props.form.setFormItemsValue(formId_03, { 'balatype': balatype });
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_capital_02();
            }
            break;
        //【弹窗】【生成财务单据】【下一步】
        case 'financenext':
            console.log(props.form.getAllFormValue(formId_01));
            this.close_finance();
            let financeselected = this.state.selectedFinanceValue;
            let financedData = props.table.getCheckedRows(tableId);
            this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: financeselected } });
            if (financeselected == "F4" || financeselected == "F5") {
                this.props.form.EmptyAllFormValue(formId_04);
                this.props.form.setFormStatus(formId_04, "edit");
                this.props.form.setFormStatus(formId_01, "edit");
                //如果是多选，则不设置默认值
                if (financedData.length == 1 || financedData.length == 0) {
                    //设置默认值
                    dialogDefaultData(props);
                }
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_finance_01();
            }
            if (financeselected == "36S4") {
                this.props.form.setFormStatus(formId_01, "edit");
                this.props.form.setFormStatus(formId_05, "edit");
                this.props.form.EmptyAllFormValue(formId_05);
                if (financedData.length != 2) {
                    toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000002'), color: 'warning' });/* 国际化处理： 请选择两条数据！*/
                    return;
                }
                //设置默认值
                dialogDefaultData(props);
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_finance_02();
            }
            //付款单、收款单
            if (financeselected == "F2" || financeselected == "F3") {
                this.props.form.setFormStatus(formId_01, "edit");
                this.props.form.setFormStatus(formId_06, "edit");
                this.props.form.EmptyAllFormValue(formId_06);
                let meta = props.meta.getMeta();
                let item = meta[formId_06].items.find(e => e.attrcode === 'busiobjtype');
                if (financeselected == "F2") {
                    //给交易对象赋值
                    item.options = [{
                        "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000003'),/* 国际化处理： 客户*/
                        "value": "0"
                    },
                    {
                        "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000004'),/* 国际化处理： 部门*/
                        "value": "2"
                    },
                    {
                        "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000005'),/* 国际化处理： 人员*/
                        "value": "3"
                    }
                    ]
                } else if (financeselected == "F3") {
                    //给交易对象赋值
                    item.options = [
                        {
                            "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000006'),/* 国际化处理： 供应商*/
                            "value": "1"
                        },

                        {
                            "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000004'),/* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000005'),/* 国际化处理： 人员*/
                            "value": "3"
                        }
                    ]
                }
                props.meta.setMeta(meta);
                this.formTempData = props.form.getAllFormValue(formId_01);
                //如果是多选，则不设置默认值
                if (financedData.length == 1 || financedData.length ==0 ) {
                    //设置默认值
                    dialogDefaultData(props);
                }
                this.open_finance_03();
            }
            break;
        //【弹窗】【选择生成资金单据，还是财务单据】【关闭】
        case 'close_generate':
            this.close_generate();
            break;
        //【弹窗】【生成资金单据】【关闭】
        case 'close_capital':
            this.close_capital();
            break;
        //【弹窗】【委托收/付款】【关闭】
        case 'close_capital_01':
            this.close_capital_01();
            break;
        //【弹窗】【资金上收/下拨】【关闭】
        case 'close_capital_02':
            this.close_capital_02();
            break;
        //【弹窗】【选择财务单据】【关闭】
        case 'close_finance':
            this.close_finance();
            break;
        //【弹窗】【收/付款结算单】【关闭】
        case 'close_finance_01':
            this.close_finance_01();
            break;
        // 【弹窗】【划账结算单】【关闭】
        case 'close_finance_02':
            this.close_finance_02();
            break;
        //【弹窗】【收/付款单】【关闭】
        case 'close_finance_03':
            this.close_finance_03();
            break;
        //【list_head】【更多操作】不生成
        case 'Nopublish':
            const nopublishData = props.table.getCheckedRows(tableId);
            if (nopublishData.length == 0) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                return;
            } else {
                nopublishData.forEach((vale) => {
                    let pk;
                    pk = vale.data.values.pk_informerrelease.value;
                    pks.push(pk);
                });
            }

            ajax({
                url: '/nccloud/cmp/informer/informerungenerate.do',
                data: {
                    pks: pks,
                    ts: null,
                },
                success: (res) => {
                    this.getdata();
                    if (res.data) {
                        toast({ content: res.data, color: 'warning' });
                    } else {
                        toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000007'), color: 'success' });/* 国际化处理： 不生单成功*/
                    }
                }
            });
            break;
        //【list_head】【更多操作】恢复生单
        case 'Recgenerate':
            url = '/nccloud/cmp/informer/informerrecgenerate.do';
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000008'), "head");/* 国际化处理： 恢复生单，成功！*/
            break;
        //【list_head】【更多操作】取消发布
        case 'Cancelpublish':
            url = '/nccloud/cmp/informer/cardunpublish.do';
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000009'), "head");/* 国际化处理： 取消发布，成功！*/
            break;
        //【list_head】取消认领
        case 'Cancelclaim': 
            url = '/nccloud/cmp/informer/cardunclaim.do';
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000010'), "head");/* 国际化处理： 取消认领，成功！*/
            break;
        //【list_head】【更多操作】取消生单
        case 'Cancelgenerate':
            url = '/nccloud/cmp/informer/cardcancelgenerate.do';
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000011'), "head");/* 国际化处理： 取消生单，成功！*/
            break;
        // 联查单据
        case 'querybills':
            queryBills(this, props);
            break;
        //打印
        case 'printbtn':
            printClick(this, id);
            break;
        case 'printout':
            printClick(this, id);
            break;
    }
}

/**
 * 刷新
 * @param {*} props 
 * @param {*} res 后台返回结果
 * @param {*} indexMap Map:key为pk，balue为index
 * @param {*} source 操作来源
 */
function refresh(that, props, res, index) {
    if (res.data != null) {
        let total = res.data.total;
        let successNum = res.data.successNum;
        let failNum = res.data.failNum;
        let opername ='';
        let hint = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000071')/* 条*/;
        let hint1= props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000070')/* 共*/;
        let hint2 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000072')/*'成功'*/;
        let hint3 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000073')/*'失败'*/;
        let content = hint1 + opername + total +hint +','+hint2+successNum + hint+','+hint3 + failNum + hint;
        if (res.data.errormessage) {
            if (total == failNum) {
                toast({
                    duration: 'infinity',
                    color: 'danger',
                    title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000074')/*' 全部失败!'*/,
                    content: content,
                    groupOperation: true,
                    TextArr: [props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000075')/*'展开'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000076')/*'收起'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000077')/*'关闭'*/],
                    groupOperationMsg: res.data.errormessage.split("\n")
                });
            } else {
                toast({
                    duration: 'infinity',
                    color: 'warning',
                    title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000078')/*' 部分失败!'*/,
                    content: content,
                    groupOperation: true,
                    TextArr: [props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000075')/*'展开'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000076')/*'收起'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000077')/*'关闭'*/],
                    groupOperationMsg: res.data.errormessage.split("\n")
                });
                that.getdata();
            }
        } else {
            toast({
                duration: 5,
                color: 'success',
                title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000079')/*' 全部成功!'*/,
                content: content,
                groupOperation: total == 1 ? false : true
            });
            that.getdata();
        }
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/