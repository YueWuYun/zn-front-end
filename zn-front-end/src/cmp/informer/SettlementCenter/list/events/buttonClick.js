/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_org, table_orgs, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, formId_07, formId_08 } from '../constants';
import { busiOperate } from './busiOperate';
import { refresh } from './refresh';
import { printClick } from './printClick';
import { queryBills } from './queryBills';
import { dialogDefaultData, dialogRedBilldefaultData } from './dialogDefaultData';
import { getGenerateData, getRedBillData } from './getGenerateData';
const { getDefData } = cardCache;
import * as CONSTANTS from '../constants';
let { dataSource } = CONSTANTS;
export default function buttonClick(props, id) {
    let url;
    let data;
    if (id == 'confirmgenerate_01' || id == 'confirmgenerate_02' || id == 'confirmgenerate_03' || id == 'confirmgenerate_04' || id == 'confirmgenerate_05') {
        id = 'confirmgenerate';
    }
    if (id == 'combine_01' || id == 'combine_02' || id == 'combine_03') {
        id = 'combine';
    }
    switch (id) {
        //【list_head】【单位内发布】
        case 'Compublish':
            url = '/nccloud/cmp/informer/informerpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000043'), "head");/* 国际化处理： 发布，成功！*/
            break;
        //【list_head】【更多操作】恢复生单
        case 'Recgenerate':
            url = '/nccloud/cmp/informer/informerrecgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000008'), "head");/* 国际化处理： 恢复生单，成功！*/
            break;
        // 【list_head】【更多操作】不生成
        case 'Nopublish':
            url = '/nccloud/cmp/informer/informerungenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000044'), "head");/* 国际化处理： 不生成，成功！*/
            break;
        //【list_head】【更多操作】取消发布
        case 'Cancelpublish':
            url = '/nccloud/cmp/informer/informerunpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000009'), "head");/* 国际化处理： 取消发布，成功！*/
            break;
        //【list_head】【更多操作】取消生单
        case 'Cancelgenerate':
            url = '/nccloud/cmp/informer/informercancelgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000011'), "head");/* 国际化处理： 取消生单，成功！*/
            break;
        //联查单据
        case 'querybills':
            queryBills(this, props);
            break;
        //【list_head】【向下级发布】
        case 'Subpublish':
            //先清空数据
            props.form.EmptyAllFormValue(formId_org);
            props.table.setAllTableData(table_orgs, { rows: [] });
            let tempselectedData = props.table.getCheckedRows(tableId);
            if (tempselectedData.length == 0) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                return;
            }
            else {
                props.form.setFormStatus(formId_org, "edit");
                props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_head' } });
                this.open_publish();
            }
            break;
        //【list_head】【生单】
        case 'Generate':
            let generateData = props.table.getCheckedRows(tableId);
            if (generateData.length == 0) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                return;
            }
            else {
                let pk_org = generateData[0].data.values.pk_org.value;
                let pk_group = generateData[0].data.values.pk_group.value;
                let pk = generateData[0].data.values.pk_informer.value;
                props.form.setFormStatus(formId_01, "edit");
                props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org } });
                props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group } });
                props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_head' } });
                props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
                if (generateData.length == 1) {
                    let memo = generateData[0].data.values.memo.value;
                    props.form.setFormItemsValue(formId_01, { 'vdef': { value: memo } });
                }
                this.open_generate();
            }
            break;
        //【list_head】【退款】
        case 'refund':
            let refundData = props.table.getCheckedRows(tableId);
            if (refundData.length == 0) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                return;
            } else if (refundData.length > 1) {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000050'), color: 'warning' });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            else {
                let pk_org = refundData[0].data.values.pk_org.value;
                let pk_group = refundData[0].data.values.pk_group.value;
                let pk = refundData[0].data.values.pk_informer.value;
                let memo = refundData[0].data.values.memo.value;
                // 收付性质
                let direction = refundData[0].data.values.direction.value;
                //付款通知
                if (direction == 'paymoney') {
                    this.props.form.setFormStatus(formId_07, "edit");
                    this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: 'F2' } });
                    dialogRedBilldefaultData(props, 'F2');
                    this.open_RedSK();
                } else {
                    this.props.form.setFormStatus(formId_08, "edit");
                    this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: 'F3' } });
                    dialogRedBilldefaultData(props, 'F3');
                    this.open_RedFK();
                }
            }
            break;
        //【弹窗】【退款】【确认】 
        case 'refundBill':
            refundData = props.table.getCheckedRows(tableId);
            // 收付性质
            let direction = refundData[0].data.values.direction.value;
            //付款通知
            if (direction == 'paymoney') {
                data = getRedBillData(props, 'F2');// 生成红字收款单
            } else {
                data = getRedBillData(props, 'F3');// 生成红字付款单
            }

            genIndexMap = data.geneinfo.indexMap;
            if (data == undefined) {
                return;
            }
            ajax({
                url: '/nccloud/cmp/informer/refund.do',
                data,
                success: (res) => {
                    refresh(props, res, genIndexMap, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000047'), 'head', index);/* 国际化处理： 生单，成功！*/
                    this.close_RedSK();
                    this.close_RedFK();
                }
            });
            break;
        //【弹窗】【退款】【取消】 
        case 'close_refund':
            this.close_RedSK();
            this.close_RedFK();
            break;
        //【弹窗】【向下级发布】【确认】
        case 'commitpublish':
            let publish_pks = [];
            let publish_indexMap = new Map();
            let orgs = props.form.getFormItemsValue(formId_org, 'pk_org').value;
            if (orgs == null || typeof orgs === 'undefined' || orgs == "") {
                toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000045'), color: 'warning' });/* 国际化处理： 请选择下级组织！*/
                return;
            }
            let pk_orgs = orgs.split(",");
            let btnarea = props.form.getFormItemsValue(formId_01, 'btnarea').value;
            let source;
            let index;
            //区分按钮的区域，来取pk值
            if (btnarea == 'list_head') {
                source = "head";
                let tempselectedData1 = props.table.getCheckedRows(tableId);
                if (tempselectedData1.length == 0) {
                    toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
                    return;
                } else {
                    tempselectedData1.forEach((vale) => {
                        let pk;
                        pk = vale.data.values.pk_informer.value;
                        publish_pks.push(pk);
                        publish_indexMap.set(pk, vale.index);
                    });
                }
            } else if (btnarea == 'list_inner') {
                source = 'inner';
                let pk_informer = props.form.getFormItemsValue(formId_01, 'pk').value;
                index = props.form.getFormItemsValue(formId_01, 'index').value;
                if (pk_informer) {
                    publish_pks.push(pk_informer);
                }
            }
            data = {
                pks: publish_pks,
                pk_orgs,
                pageid: pagecode
            };
            ajax({
                url: '/nccloud/cmp/informer/informerpublish.do',
                data,
                success: (res) => {
                    //刷新
                    this.close_publish();
                    refresh(props, res, publish_indexMap, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000046'), source, index);/* 国际化处理： 向下级发布，成功！*/
                }
            });
            break;
        //【弹窗】【生单】【确认】
        case 'confirmgenerate':
            let formTempData = this.formTempData;
            props.form.setAllFormValue({ 'form_generate_01': formTempData });
            index = props.form.getFormItemsValue(formId_01, 'index').value;
            btnarea = props.form.getFormItemsValue(formId_01, 'btnarea').value;
            source;
            if (btnarea == 'list_head') {
                source = 'head';
            } else {
                source = 'inner';
            }
            data = getGenerateData(props);
            let genIndexMap = data.geneinfo.indexMap;
            if (data == undefined) {
                return;
            }
            ajax({
                url: '/nccloud/cmp/informer/informergenerate.do',
                data,
                success: (res) => {
                    refresh(props, res, genIndexMap, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000047'), source, index);/* 国际化处理： 生单，成功！*/
                    this.close_generate();
                    this.close_capital_01();
                    this.close_capital_02();
                    this.close_finance_01();
                    this.close_finance_02();
                    this.close_finance_03();
                }
            });
            break;
        //【弹窗】【向下级发布】【关闭】
        case 'close_publish':
            this.close_publish();
            break;
        //【弹窗】【选择生成资金单据，还是财务单据】【下一步】
        case 'generatenext':
            this.close_generate();
            let generateSelected = this.state.selectedGenerateValue;
            if (generateSelected == "capital") {
                props.form.EmptyAllFormValue(formId_02);
                props.form.EmptyAllFormValue(formId_03);
                this.open_capital();
            }
            if (generateSelected == "finance") {
                props.form.EmptyAllFormValue(formId_04);
                props.form.EmptyAllFormValue(formId_05);
                props.form.EmptyAllFormValue(formId_06);
                this.open_finance();
            }
            break;
        //【弹窗】【生成资金单据】【下一步】
        case 'capitalnext':
            this.close_capital();
            let capitalselected = this.state.selectedCapitalValue;
            let tableData;
            let pk_fundorg;
            let fundorgdiplay;
            //委托收款，委托付款
            if (capitalselected == "36J7" || capitalselected == "36J5") {
                this.props.form.setFormStatus(formId_02, "edit");
                this.props.form.EmptyAllFormValue(formId_02);
                //收、付资金组织设置默认值
                tableData = this.props.table.getAllTableData("table");
                pk_fundorg = tableData.rows[0].values.pk_org.value;
                fundorgdiplay = tableData.rows[0].values.pk_org.display;
                this.props.form.setFormItemsValue(formId_02, { 'pk_FundOrg': { value: pk_fundorg, display: fundorgdiplay } });
                //保存生单类型
                this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: capitalselected } });
                //摘要默认值
                let memo = props.form.getFormItemsValue(formId_01, 'vdef').value;
                this.props.form.setFormItemsValue(formId_02, { 'remark': { value: memo } });
                dialogDefaultData(props);
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_capital_01();
            }
            //资金上收，资金下拨
            if (capitalselected == "36K4" || capitalselected == "36K2") {
                this.props.form.setFormStatus(formId_03, "edit");
                this.props.form.EmptyAllFormValue(formId_03);
                //摘要默认值
                let memo = props.form.getFormItemsValue(formId_01, 'vdef').value;
                this.props.form.setFormItemsValue(formId_03, { 'remark': { value: memo } });
                this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: capitalselected } });
                dialogDefaultData(props);
                this.formTempData = props.form.getAllFormValue(formId_01);
                this.open_capital_02();
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
        //【弹窗】【生成财务单据】【下一步】
        case 'financenext':
            this.close_finance();
            let financeselected = this.state.selectedFinanceValue;
            let financedData = props.table.getCheckedRows(tableId);
            this.props.form.setFormItemsValue(formId_01, { 'generatetype': { value: financeselected } });

            //付款结算单，收款结算单
            if (financeselected == "F4" || financeselected == "F5") {
                this.props.form.setFormStatus(formId_04, "edit");
                this.props.form.EmptyAllFormValue(formId_04);
                this.props.form.setFormStatus(formId_01, "edit");
                this.props.form.setFormItemsDisabled(formId_04, { 'pk_customer': false });
                this.props.form.setFormItemsDisabled(formId_04, { 'pk_supplier': false });
                this.props.form.setFormItemsDisabled(formId_04, { 'pk_person': false });
                this.props.form.setFormItemsDisabled(formId_04, { 'accountname': true });
                //如果是多选，则不设置默认值
                if (financedData.length > 1) {
                    this.formTempData = props.form.getAllFormValue(formId_01);
                    this.open_finance_01();
                } else {
                    //设置默认值
                    dialogDefaultData(props);
                    this.formTempData = props.form.getAllFormValue(formId_01);
                    this.open_finance_01();
                }

            }
            if (financeselected == "36S4") {
                this.props.form.setFormStatus(formId_01, "edit");
                this.props.form.setFormStatus(formId_05, "edit");
                this.props.form.EmptyAllFormValue(formId_05);
                if (financedData.length > 1 && financedData.length < 3) {
                    let settledate = financedData[0].data.values.infodate.value;
                    this.props.form.setFormItemsValue(formId_05, { 'settleDate': { value: settledate } });
                } else {
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
                this.props.form.setFormItemsDisabled(formId_06, { 'pk_customer': false });
                this.props.form.setFormItemsDisabled(formId_06, { 'pk_supplier': false });
                this.props.form.setFormItemsDisabled(formId_06, { 'pk_person': false });

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
                //如果是多选，则不设置默认值
                if (financedData.length > 1) {
                    this.formTempData = props.form.getAllFormValue(formId_01);
                    this.open_finance_03();
                } else {
                    //设置默认值
                    this.formTempData = props.form.getAllFormValue(formId_01);
                    dialogDefaultData(props);
                    this.open_finance_03();
                }
            }
            break;
        // 【弹窗】【选择财务单据】【关闭】
        case 'close_finance':
            this.close_finance();
            break;
        //【弹窗】【收/付款结算单】【关闭】
        case 'close_finance_01':
            this.close_finance_01();
            break;
        //【弹窗】【划账结算单】【关闭】
        case 'close_finance_02':
            this.close_finance_02();
            break;
        //【弹窗】【收/付款单】【关闭】
        case 'close_finance_03':
            this.close_finance_03();
            break;
        //【弹窗】【合并生单】
        case 'combine':
            formTempData = this.formTempData;
            props.form.setAllFormValue({ 'form_generate_01': formTempData });
            index = props.form.getFormItemsValue(formId_01, 'index').value;
            btnarea = props.form.getFormItemsValue(formId_01, 'btnarea').value;
            source;
            if (btnarea == 'list_head') {
                source = 'head';
            } else {
                source = 'inner';
            }
            data = getGenerateData(props);
            let combine_indexMap = data.geneinfo.indexMap;
            if (data == undefined) {
                return;
            }
            ajax({
                url: '/nccloud/cmp/informer/informercombine.do',
                data,
                success: (res) => {
                    this.close_generate();
                    this.close_capital_01();
                    this.close_capital_02();
                    this.close_finance_01();
                    this.close_finance_02();
                    this.close_finance_03();
                    refresh(props, res, combine_indexMap, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000048'), source, index);/* 国际化处理： 合并生单，成功！*/
                }
            });
            break;

        //打印
        case 'printbtn':
            printClick(this, props, 'print');
            break;
        //输出
        case 'printout':
            printClick(this, props, id);
            break;
        //刷新
        case 'refresh':
            query(this, props);
            break;
    }
}

/**
 * 根据缓存中的查询条件，刷新
 * @param {*} that 
 * @param {*} props 
 * @param {*} searchVal 
 */
function query(that, props) {
    let searchData = getDefData(dataSource, that.listDataSource);
    if (!searchData) {
        searchData = props.search.getAllSearchData('search');
    }

    let pageInfo = props.table.getTablePageInfo('table');
    pageInfo.pageIndex = 0;
    let data = {
        querycondition: searchData,
        pageInfo: pageInfo,
        pageCode: '36070AI_L01',
        queryAreaCode: 'search',  //查询区编码
        oid: '0001Z61000000000P938',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    ajax({
        url: '/nccloud/cmp/informer/informerquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    that.props.table.setAllTableData(that.tableId, data[that.tableId]);
                } else {
                    that.props.table.setAllTableData(that.tableId, { rows: [] });                    
                }
                toast({ color: 'success', content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000064') });
            }
        }
    });

}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/