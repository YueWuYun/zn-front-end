/*WCB3AJHqGDlPS44UabI4xTV1OSBc2MnH+V6WU5+sMe+hGQ8i5Lc158/QNMBARcKD*/
import { createPage, ajax, base, toast, cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';

let { getNextId, getCurrentLastId, deleteCacheById, deleteCacheId, getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;

import { app_id, base_url, 
    list_page_id, list_search_id, list_table_id,
    card_page_id, link_list_page_id,
    button_limit, oid, dataSourceLink
} from '../../cons/constant.js';

// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';

export default async function tabButtonClick(props, key, text, record, index) {
    let that = this;
    switch (key) {
        // 修改
        case 'edit_inner':
            let editData = {
                pk: record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record.ts && record.ts.value,
                pageid: card_page_id,
                status: 'edit',
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryquerycard.do',
                data: editData,
                success: (res) => {
                    if (res.data) {
                        props.pushTo("/card",{
                            status: 'edit',
                            id: record.pk_delivery_h && record.pk_delivery_h.value,
                            pagecode: card_page_id,
                        });
                    }
                }
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
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000006') });/* 国际化处理： 退回成功*/
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
            this.pk_delivery_h = record.pk_delivery_h.value;
            this.ts = record.ts.value;
            ajax({
                url: '/nccloud/sf/delivery/deliverycommit.do',
                data: {
                    pks: [record.pk_delivery_h.value],
                    tss: [record.ts.value]
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if(data && data.errorMsg){
                            toast({ color: 'warning', content: data.errorMsg });
                        }else{
                            if(res.data.workflow && 
                                (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')){
                                that.setState({
                                    compositedata: res.data,
                                    compositedisplay: true,
                                });
                            }else{
                                if(res.data.warningMsg){
                                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007')+res.data.warningMsg });/* 国际化处理： 提交成功*/
                                }else{
                                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });/* 国际化处理： 提交成功*/
                                }
                                refresh(that, props);
                            }
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
                        if(data && data.errorMsg){
                            toast({ color: 'warning', content: res.data.errorMsg });
                        }else{
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008') });/* 国际化处理： 收回成功*/
                        }
                        refresh(that, props);
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
                        that.setState(
                        {
                            onLineData: res.data || [],
                            modelType: SHOWMODEL_LIULAN,
                            showBuLu: true,
                        })
                    }
                }
            });
            break;
        // 网银补录
        case 'netbankbulu_inner':
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
                            that.setState(
                            {
                                onLineData: res.data || [],
                                modelType: SHOWMODEL_BULU,
                                showBuLu: true,
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
            let ismendinfofull_pay = record && record.ismendinfofull;
            let isKey_pay = false;
            if(ismendinfofull_pay && ismendinfofull_pay.value){
                isKey_pay = true;
            }
            let payresult = await Sign({
                isSign: false,
                isKey: isKey_pay,
                data: null,
                encryptVOClassName: null
            });
			if (payresult.isStop) {
				return;
			}
            //自定义请求数据
            let pay_innerData = {
                pk: record && record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record && record.ts && record.ts.value
            };

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
                            props.modal.show('payModel',{
                                title: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000012'),/* 国际化处理： 支付*/
                                content: data.interactMsg,
                                //点击确定按钮事件
                                beSureBtnClick: tabButtonClick.bind(this, props ,'pay_innerConfirm', text, record, index),
                            });
                        }
                        else if(data.warningMsg){
                            toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011')+data.warningMsg });/* 国际化处理： 支付成功*/
                            refresh(that, props);
                        }
                        else if(data.successMsg){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });/* 国际化处理： 支付成功*/
                            refresh(that, props);
                        }
                    }
                }
            });
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
                pk: record && record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record && record.ts && record.ts.value,
                operator: 1,
            };
            ajax({
                url: '/nccloud/sf/delivery/deliverypay.do',
                data: pay_innerConfirmData,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });/* 国际化处理： 支付成功*/
                            refresh(that, props);
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
                pk: record.pk_delivery_h && record.pk_delivery_h.value,
                ts: record.ts && record.ts.value,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryunpay.do',
                data: unpay_data,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013') });/* 国际化处理： 取消支付成功*/
                            refresh(that, props);
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
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000027') });/* 国际化处理： 支付状态成功*/
                            refresh(that, props);
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
                    billid: record.pk_delivery_h && record.pk_delivery_h.value,
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
                            refresh(that, props);
                        }
                        else if(data.successMsg){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                            refresh(that, props);
                        }
                        else{
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                            refresh(that, props);
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
                            refresh(that, props);
                        }
                        else if(data.successMsg){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                            refresh(that, props);
                        }
                        else{
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                            refresh(that, props);
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
        pagecode: link_list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: oid,  
        querytype: 'tree'
    };

    ajax({
        url: '/nccloud/sf/delivery/deliveryquery.do',
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