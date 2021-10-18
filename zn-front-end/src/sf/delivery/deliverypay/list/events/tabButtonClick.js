/*WCB3AJHqGDlPS44UabI4xTV1OSBc2MnH+V6WU5+sMe+hGQ8i5Lc158/QNMBARcKD*/
import { createPage, ajax, base, toast, cardCache, promptBox } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';

let { getNextId, getCurrentLastId, deleteCacheById, deleteCacheId, getCacheById, updateCache, addCache } = cardCache;
import {
    list_page_id, list_search_id, list_table_id,
    card_page_id
} from '../../cons/constant.js';

// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { payBeforeValidate } from "../../../delivery/util/index";

export default async function tabButtonClick(props, key, text, record, index) {
    let that = this;
    switch (key) {
        // 修改
        case 'edit_inner':
            props.pushTo("/card",{
                status: 'edit',
                id: record.pk_delivery_h && record.pk_delivery_h.value,
                pagecode: card_page_id,
            });
            break;
        // 删除
        case 'delete_inner':
            let deleteData = {
                pks: [record.pk_delivery_h && record.pk_delivery_h.value],
                tss: [record.ts && record.ts.value],
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverydel.do',
                data: deleteData,
                success: (res) => {
                    if (res.success) {
                        if(res.data && res.data.errormsg){
                            toast({ color: 'warning', content: res.data.errormsg });
                            if(res.data && res.data.successpks){
                                deleteCacheId(list_table_id, record.pk_delivery_h.value);
                                that.props.table.deleteTableRowsByIndex(list_table_id, index);
                            }
                        }else{
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000050') });/* 国际化处理： 删除成功*/
                            if(res.data && res.data.successpks){
                                deleteCacheId(list_table_id, record.pk_delivery_h.value);
                                that.props.table.deleteTableRowsByIndex(list_table_id, index);
                            }
                        }
                    }
                }
            });
            break;
        // 经办
        case 'decide_inner':
            props.pushTo("/card",{
                status: 'decide',
                id: record.pk_delivery_h && record.pk_delivery_h.value,
                pagecode: card_page_id,
            });
            break;
        // 退回
        case 'back_inner':
            props.modal.show('backModel',{
                //点击确定按钮事件
                // beSureBtnClick: tabButtonClick.bind(this, props ,'back_innerconfirm', text, record, index),
                beSureBtnClick: (props, key) => tabButtonClick.call(that, props ,'back_innerconfirm', text, record, index),
            });
            break;
        // 退回确认
        case 'back_innerconfirm':
            let backdataArr = [];
            let backtsArr = [];
            //主键数组
            backdataArr.push(record.pk_delivery_h.value);
            backtsArr.push(record.ts.value);
            let backdata = {
                pks: backdataArr,
                tss: backtsArr,
                returnnote: this.state.returnnote,
            };
            ajax({
                url: '/nccloud/sf/delivery/deliveryback.do',
                data: backdata,
                success: (res) => {
                    if (res.success) {
                        if(res.data && res.data.errormsg){
                            toast({ color: 'warning', content: res.data.errormsg });
                        }else{
                            /* 国际化处理： 退回成功*/
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                             && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000006') });
                            deleteCacheId(list_table_id, record.pk_delivery_h.value);
                            that.props.table.deleteTableRowsByIndex(list_table_id, index);
                        }
                        // refresh.call(this, this.props);
                    }
                }
            });
            break;
        // 提交
        case 'commit_inner':
            ajax({
                url: '/nccloud/sf/delivery/deliverycommit.do',
                data: {
                    pks: [record.pk_delivery_h.value],
                    tss: [record.ts.value]
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if(res.data && res.data.errorMsg){
                            toast({ color: 'warning', content: data.errormsg });
                        }else{
                            /* 国际化处理： 提交成功*/
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                             && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });
                        }
                        // refresh(that, props);
                        if(data.grid){
                            that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                        }
                    } else {
                        props.table.setAllTableData(list_table_id, { rows: [] });
                    }
                }
            });
            break;
        // 收回
        case 'umcommit_inner':
            ajax({
                url: '/nccloud/sf/delivery/deliveryuncommit.do',
                data: {
                    pks: [record.pk_delivery_h.value],
                    tss: [record.ts.value]
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if(res.data && res.data.errorMsg){
                            toast({ color: 'warning', content: res.data.errorMsg });
                        }else{
                            /* 国际化处理： 收回成功*/
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                             && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008') });
                        }
                        // refresh(that, props);
                        if(res.data.grid){
                            that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: res.data.grid[list_table_id].rows[0].values }}]);
                        }
                    } else {
                        props.table.setAllTableData(list_table_id, { rows: [] });
                    }
                }
            });
            break;
        // 网银浏览
        case 'netbankbrowse_inner':
            let netbankbrowse_data = {
                pk: record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record.ts && record.ts.value,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverynetbankbrowse.do',
                data: netbankbrowse_data,
                success: (res) => {
                    if (res && res.data) {
                        that.setState({
                            onLineData: res.data || [],
                            modelType: SHOWMODEL_LIULAN,
                            }, () => {
                            that.setState({ showBuLu: true });
                        });
                    }
                }
            });
            break;
        // 网银补录
        case 'netbankbulu_inner':
            this.pk_delivery_h = record.pk_delivery_h.value;
            this.ts = record.ts.value;
            this.isTableInnerOpt = true;
            this.index = index;
            
            let netbankbulu_data = {
                pk: record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record.ts && record.ts.value,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverynetbankrewrite.do',
                data: netbankbulu_data,
                success: (res) => {
                    if (res && res.data) {
                        if(res.data && res.data.errormsg){
                            toast({ color: 'warning', content: res.data.errormsg });
                            return;
                        }else{
                            if(res.data[0] && res.data[0].yurref){
                                that.setState({
                                    onLineData: res.data || [],
                                    modelType: SHOWMODEL_BULU,
                                    }, () => {
                                    that.setState({ showBuLu: true });
                                });
                            }else{
                                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000084') });/* 国际化处理： 请选择已经网银补录过的单据进行操作！*/
                            }
                        }
                    }
                }
            });
            break;
        // 支付
        case 'pay_inner':
            //自定义请求数据
            let pay_innerData = {
                pks: [record && record.pk_delivery_h && record.pk_delivery_h.value],
                tss: [record && record.ts && record.ts.value],
                pageid: list_page_id,
                pagecode : list_page_id,
                btncode : "pay_inner"
            };
            let payBeforeData = await payBeforeValidate(this.props, pay_innerData);
            if(payBeforeData){
                if(payBeforeData.errorMsg){
                    toast({ color: 'warning', content: payBeforeData.errorMsg });
                }
                else if(payBeforeData.interactMsg){
                    promptBox({
                        color: "warning",
                        content: payBeforeData.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: tabButtonClick.bind(this, props ,'pay_innerConfirm', text, record, index),
                    });
                }
                else if(payBeforeData.successMsg){
                    let ismendinfofull_pay = record && record.ismendinfofull;
                    let isKey_pay = false;
                    if(ismendinfofull_pay && ismendinfofull_pay.value){
                        isKey_pay = true;
                    }
                    let payresult = await Sign({
                        isSign: true,
                        isKey: isKey_pay,
                        data: null,
                        encryptVOClassName: null,
                        primaryId: [record && record.pk_delivery_h && record.pk_delivery_h.value],
                    });
                    if (payresult.isStop) {
                        return;
                    }
                    pay_innerData.sign_strSrc = payresult.data.text,
                    pay_innerData.signature = payresult.data.signText,
                    pay_innerData.sing_sn = payresult.data.userjson,
                    ajax({
                        url: '/nccloud/sf/delivery/deliverypay.do',
                        data: pay_innerData,
                        success: function (res) {
                            let { success, data } = res;
                            if (success) {
                                if(data.errorMsg){
                                    toast({ color: 'warning', content: data.errorMsg });
                                }
                                else if(data.interactMsg){
                                    promptBox({
                                        color: "warning",
                                        content: data.interactMsg,
                                        //点击确定按钮事件
                                        beSureBtnClick: tabButtonClick.bind(this, props ,'pay_innerConfirm', text, record, index),
                                    });
                                }
                                else if(data.warningMsg){
                                    toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011')+data.warningMsg });/* 国际化处理： 支付成功*/
                                    // refresh(that, props);
                                }
                                else if(data.successMsg){
                                    toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });/* 国际化处理： 支付成功*/
                                    // refresh(that, props);
                                }
                                if (data.grid) {
                                    that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                                }
                            }
                        }
                    });
                }
            }
            break;
        // 支付确认
        case 'pay_innerConfirm':
            let ismendinfofull_pay_innerConfirm = record && record.ismendinfofull;
            let isKey_pay_innerConfirm = false;
            if(ismendinfofull_pay_innerConfirm && ismendinfofull_pay_innerConfirm.value){
                isKey_pay_innerConfirm = true;
            }
            let pay_innerConfirmresult = await Sign({
                isSign: false,
                isKey: isKey_pay_innerConfirm,
                data: null,
                encryptVOClassName: null
            });
            if (pay_innerConfirmresult.isStop) {
                return;
            }
            //自定义请求数据
            let pay_innerConfirmData = {
                pks: [record && record.pk_delivery_h && record.pk_delivery_h.value],
                tss: [record && record.ts && record.ts.value],
                operator: 1,
                pagecode : list_page_id,
                btncode : "pay_innerConfirm"
            };
            ajax({
                url: '/nccloud/sf/delivery/deliverypay.do',
                data: pay_innerConfirmData,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            /* 国际化处理： 支付成功*/
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                             && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });
                            // refresh(that, props);
                            if(data.grid){
                                that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                            }
                        } else {
                            props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                    }
                }
            });
            break;
        // 取消支付
        case 'unpay_inner':
            let unpay_data = {
                pks: [record.pk_delivery_h && record.pk_delivery_h.value],
                tss: [record.ts && record.ts.value],
                pageid: list_page_id,
                pagecode : list_page_id,
                btncode : "unpay_inner"
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryunpay.do',
                data: unpay_data,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            if(res.data.errorMsg){
                                toast({ color: 'warning', content: res.data.errorMsg });
                                // refreshHtml(that, props);
                            }
                            else if(res.data.warningMsg){
                                /* 国际化处理： 取消支付成功*/
                                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") 
                                && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013')+ res.data.warningMsg });
                                // refreshHtml(that, props);
                            }
                            else if(res.data.successMsg){
                                /* 国际化处理： 取消支付成功*/
                                toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") 
                                && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013') });
                                // refreshHtml(that, props);
                            }
                            // refresh(that, props);
                            if(res.data.grid){
                                that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: res.data.grid[list_table_id].rows[0].values }}]);
                            }
                        }
                    }
                }
            });
            break;
        // 支付状态
        case 'paystatus_inner':
            let paystatus_data = {
                pk: record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record.ts && record.ts.value,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryquerypaystatus.do',
                data: paystatus_data,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            // refresh(that, props);
                            if(res.data.errorMsg){
                                toast({ color: 'warning', content: res.data.errorMsg });
                            }
                            else if(res.data.successMsg){
                                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000027') });/* 国际化处理： 支付状态成功*/
                                if(res.data.grid){
                                    that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: res.data.grid[list_table_id].rows[0].values }}]);
                                }
                            }
                        }
                    }
                }
            });
            break;    
        // 查看审批意见
        case 'reviewapprove_inner':
            if(record){
                this.setState({
                    approveshow: !this.state.approveshow,
                    //单据pk
                    billId: record.pk_delivery_h && record.pk_delivery_h.value,
                });
            }
            break;
        // 制证
        case 'voucher_inner':
            let voucherpk = [];
            voucherpk.push(record.pk_delivery_h && record.pk_delivery_h.value);
            let voucherts = [];
            voucherts.push(record.ts && record.ts.value);
            let voucherdata = {
                pks: voucherpk,
                tss: voucherts,
                pagecode : list_page_id,
                btncode : "voucher_inner"
            };
            ajax({
                url: '/nccloud/sf/delivery/deliverymakevoucher.do',
                data: voucherdata,
                success: (res) => {
                    let { success, data } = res;
                    if(success){
                        if(data.errorMsg){
                            toast({ color: 'warning', content: data.errorMsg });
                        }
                        else if(data.warningMsg){
                            toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                            // refresh(that, props);
                        }
                        else if(data.successMsg){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                            // refresh(that, props);
                        }
                        else{
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                            // refresh(that, props);
                        }
                        if(data.grid){
                            that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                        }
                    }
                }
            });
            break;
        // 取消制证
        case 'cancelvoucher':
            let cancelvoucherpk = [];
            cancelvoucherpk.push(record.pk_delivery_h && record.pk_delivery_h.value);
            let cancelvoucherts = [];
            cancelvoucherts.push(record.ts && record.ts.value);
            let cancelvoucherdata = {
                pks: cancelvoucherpk,
                tss: cancelvoucherts,
                pagecode : list_page_id,
                btncode : "cancelvoucher"
            };
            ajax({
                url: '/nccloud/sf/delivery/deliverycancelvoucher.do',
                data: cancelvoucherdata,
                success: (res) => {
                    let { success, data } = res;
                    if(success){
                        if(data.errorMsg){
                            toast({ color: 'warning', content: data.errorMsg });
                        }
                        else if(data.warningMsg){
                            toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                            // refresh(that, props);
                        }
                        else if(data.successMsg){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                            // refresh(that, props);
                        }
                        else{
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                            // refresh(that, props);
                        }
                        if(data.grid){
                            that.props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                        }
                    }
                }
            });
            break;
        default:
            break;
    }
}

//刷新列表信息
function refresh(that, props) {
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    //查询condition
    let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;
    let data={
        querycondition: refreshsearchVal,
        custcondition: {
            logic: "and",   //逻辑操作符，and、or
            conditions: [
            ],
        },
        conditions: refreshsearchVal.conditions || refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: oid,  
        querytype: 'tree'
    };

    ajax({
        url: '/nccloud/sf/delivery/deliverypayquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data.grid){
                    props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                }else{
                    props.table.setAllTableData(list_table_id, { rows: [] });
                }
                if (data.numvalues) {
                    that.setState({ numvalues: data.numvalues, activeKey: 6 });
                }else{
                    that.setState({ numvalues: {} });
                }
            }
        }
    });
}

/*WCB3AJHqGDlPS44UabI4xTV1OSBc2MnH+V6WU5+sMe+hGQ8i5Lc158/QNMBARcKD*/