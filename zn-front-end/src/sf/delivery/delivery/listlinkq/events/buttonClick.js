/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, output, print, cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
let { deleteCacheId, getCacheById, updateCache, setDefData } = cardCache;

let { NCMessage } = base;
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { elecSignListPrint, loadMultiLang } from '../../../../../tmpub/pub/util/index'
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';

import {
    app_id, appcode, oid, printnodekey,
    list_page_id, list_search_id, list_table_id, link_list_page_id,
    cachesearchKey, dataSourceLink, cacheTabKey,
    card_page_id, url, field, state
} from '../../cons/constant.js';

export default async function buttonClick(props, id) {
    let that = this;
    const selectedData = props.table.getCheckedRows(this.tableId);
    let indexArr = [];
    let dataArr = [];
    let tsArr = [];
    let delObj = {
        status: '3',
        values: {
            ts: {
                display: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000066'),/* 国际化处理： 时间戳*/
            },
            pk: {
                display: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000067'),/* 国际化处理： 主键*/
            }
        }
    };

    let batchData = ['delete', 'commit', 'uncommit',
        'back', 'voucher', 'cancelvoucher', 'file', 'print', 'output'];
    if (batchData.indexOf(id) >= 0) {
        if (selectedData.length == 0) {
            NCMessage.create({ content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000068'), color: 'warning', position: 'top' });/* 国际化处理： 请选择数据*/
            return;
        }

        //处理选择数据
        selectedData.forEach((val) => {
            delObj.rowId = val.data.rowId;
            //ts时间戳
            delObj.values.ts.value = val.data.values.ts.value;
            //主键数组
            dataArr.push(val.data.values.pk_delivery_h.value);
            tsArr.push(val.data.values.ts.value);
            indexArr.push(val.index);
            // 提交指派使用(单条记录)
            this.pk_delivery_h = val.data.values.pk_delivery_h.value;
            this.ts = val.data.values.ts.value;
        });
    }
    //自定义请求数据
    let data = {
        pks: dataArr,
        tss: tsArr
    };

    switch (id) {
        // 新增
        case 'add':
            props.pushTo("/card", {
                status: 'add',
                id: '',
                pagecode: card_page_id,
            });
            break;
        // 删除
        case 'delete':
            this.props.modal.show('delete');
            break;
        //复制
        case 'copy':
            let copyData = props.table.getCheckedRows(list_table_id);
            //数据校验
            if (copyData.length != 1) {
                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000069') });	/* 国际化处理： 请选择1条数据*/
                return
            }
            let copyid;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_delivery_h.value;
            });
            props.pushTo("/card", {
                status: "copy",
                id: copyid,
                pagecode: card_page_id,
            });
            break;
        // 提交
        case 'commit':
            ajax({
                url: '/nccloud/sf/delivery/deliverycommit.do',
                data: data,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.errorMsg) {
                            toast({ color: 'warning', content: res.data.errorMsg });
                        } else {
                            if (res.data.workflow &&
                                (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                                this.setState({
                                    compositedata: res.data,
                                    compositedisplay: true,
                                });
                            } else {
                                if (res.data.warningMsg) {
                                    toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') + res.data.warningMsg });/* 国际化处理： 提交成功*/
                                } else {
                                    toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });/* 国际化处理： 提交成功*/
                                }
                                refreshHtml(that, props);
                            }
                        }
                    }
                }
            });
            break;
        // 收回
        case 'uncommit':
            ajax({
                url: '/nccloud/sf/delivery/deliveryuncommit.do',
                data: data,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.errormsg) {
                            toast({ color: 'warning', content: res.data.errorMsg });
                        } else {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008') });/* 国际化处理： 收回成功*/
                        }
                        refreshHtml(that, props);
                    }
                }
            });
            break;
        // 退回
        case 'back':
            props.modal.show('backModel', {
                //点击确定按钮事件
                beSureBtnClick: buttonClick.bind(this, props, 'backconfirm')
            });
            break;
        // 退回确认
        case 'backconfirm':
            let backdataArr = [];
            let backtsArr = [];
            //处理选择数据
            selectedData.forEach((val) => {
                //主键数组
                backdataArr.push(val.data.values.pk_delivery_h.value);
                backtsArr.push(val.data.values.ts.value);
            });
            let backdata = {
                pks: backdataArr,
                tss: backtsArr,
                returnnote: this.state.returnnote
            };
            ajax({
                url: '/nccloud/sf/delivery/deliveryback.do',
                data: backdata,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.errormsg) {
                            toast({ color: 'warning', content: res.data.errormsg });
                        } else {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000006') });/* 国际化处理： 退回成功*/
                            if (res.data && res.data.successpks) {
                                const selecteBackData = this.props.table.getCheckedRows(this.tableId);
                                let successpks = res.data.successpks.split(',');
                                for (let index = 0; index < selecteBackData.length; index++) {
                                    const pk_delivery_h = selecteBackData[index].data.values.pk_delivery_h.value
                                    if (successpks.indexOf(pk_delivery_h) >= 0) {
                                        deleteCacheId(list_table_id, pk_delivery_h);
                                        props.table.deleteTableRowsByIndex(list_table_id, selecteBackData[index].index);
                                    }
                                }
                            }
                        }
                        // refreshHtml(props);
                    }
                }
            });
            break;
        // 制证
        case 'voucher':
            ajax({
                url: '/nccloud/sf/delivery/deliverymakevoucher.do',
                data: data,
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
                        refreshHtml(that, props);
                    }
                }
            });
            break;
        // 取消制证
        case 'cancelvoucher':
            ajax({
                url: '/nccloud/sf/delivery/deliverycancelvoucher.do',
                data: data,
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
                        refreshHtml(that, props);
                    }
                }
            });
            break;
        // 网银浏览
        case 'netbankbrowse':
            if (selectedData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }

            let netbankbrowse_pk, netbankbrowse_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                netbankbrowse_pk = val.data.values.pk_delivery_h.value;
                //ts时间戳
                netbankbrowse_ts = val.data.values.ts.value;
            });
            let netbankbrowsedata = {
                pk: netbankbrowse_pk,
                ts: netbankbrowse_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverynetbankbrowse.do',
                data: netbankbrowsedata,
                success: (res) => {
                    if (res && res.data) {
                        if (res.data[0] && res.data[0].yurref) {
                            this.setState(
                                {
                                    onLineData: res.data || [],
                                    modelType: SHOWMODEL_LIULAN,
                                }, () => {
                                    this.setState({ showBuLu: true });
                                });
                        } else {
                            toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000084') });/* 国际化处理： 请选择已经网银补录过的单据进行操作！*/
                        }
                    }
                }
            });
            break;
        // 网银补录
        case 'netbankbulu':
            if (selectedData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }

            let netbankbulu_pk, netbankbulu_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                netbankbulu_pk = val.data.values.pk_delivery_h.value;
                //ts时间戳
                netbankbulu_ts = val.data.values.ts.value;
            });
            let netbankbuludata = {
                pk: netbankbulu_pk,
                ts: netbankbulu_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverynetbankrewrite.do',
                data: netbankbuludata,
                success: (res) => {
                    if (res && res.data) {
                        this.setState(
                            {
                                onLineData: res.data || [],
                                modelType: SHOWMODEL_BULU,
                            }, () => {
                                this.setState({ showBuLu: true });
                            });
                    }
                }
            });
            // refreshHtml(props);
            break;
        // 支付
        case 'pay':
            let pay_pk, pay_ts, ismendinfofull_pay;
            //处理选择数据
            selectedData.forEach((val) => {
                pay_pk = val.data.values.pk_delivery_h.value;
                //ts时间戳
                pay_ts = val.data.values.ts.value;
                ismendinfofull_pay = val.data.values.ismendinfofull.value;
            });
            let isKey_pay = false;
            if (ismendinfofull_pay && ismendinfofull_pay.value) {
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
            let payData = {
                pk: pay_pk,
                ts: pay_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverypay.do',
                data: payData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.errorMsg) {
                            toast({ color: 'warning', content: data.errorMsg });
                            refreshHtml(that, props);
                        }
                        else if (data.interactMsg) {
                            props.modal.show('payModel', {
                                title: that.props.MutiInit.getIntl("36320FDAPay") && that.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000014'),/* 国际化处理： 支付*/
                                content: data.interactMsg,
                                //点击确定按钮事件
                                beSureBtnClick: buttonClick.bind(this, props, 'payBtnConfirm'),
                            });
                        }
                        else if (data.warningMsg) {
                            toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDAPay") && that.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000013') + data.warningMsg });/* 国际化处理： 支付成功*/
                            refreshHtml(that, props);
                        }
                        else if (data.successMsg) {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDAPay") && that.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000013') });/* 国际化处理： 支付成功*/
                            refreshHtml(that, props);
                        }
                    }
                }
            });
            break;
        // 支付确认
        case 'payBtnConfirm':
            if (selectedData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }
            let payBtnConfirm_pk, payBtnConfirm_ts, ismendinfofull_payBtnConfirm;
            //处理选择数据
            selectedData.forEach((val) => {
                payBtnConfirm_pk = val.data.values.pk_delivery_h.value;
                //ts时间戳
                payBtnConfirm_ts = val.data.values.ts.value;
                ismendinfofull_payBtnConfirm = val.data.values.ismendinfofull.value;
            });
            let isKey_payBtnConfirm = false;
            if (ismendinfofull_payBtnConfirm && ismendinfofull_payBtnConfirm.value) {
                isKey_payBtnConfirm = true;
            }
            let payBtnConfirmresult = await Sign({
                isSign: false,
                isKey: isKey_payBtnConfirm,
                data: null,
                encryptVOClassName: null
            });
            if (payBtnConfirmresult.isStop) {
                return;
            }
            let payBtnConfirmData = {
                pk: payBtnConfirm_pk,
                ts: payBtnConfirm_ts,
                pageid: list_page_id,
                operator: 1,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliverypay.do',
                data: payBtnConfirmData,
                success: (res) => {
                    if (res.success) {
                        if (res.data) {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDAPay") && that.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000013') });/* 国际化处理： 支付成功*/
                        }
                        refreshHtml(that, props);
                    }
                }
            });
            break;
        // 取消支付
        case 'unpay':
            let unpay_pk, unpay_ts;
            //处理选择数据
            selectedData.forEach((val) => {
                unpay_pk = val.data.values.pk_delivery_h.value;
                //ts时间戳
                unpay_ts = val.data.values.ts.value;
            });
            let unpayData = {
                pk: unpay_pk,
                ts: unpay_ts,
                pageid: list_page_id,
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryunpay.do',
                data: unpayData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.errorMsg) {
                            toast({ color: 'warning', content: data.errorMsg });
                            refreshHtml(that, props);
                        }
                        else if (data.warningMsg) {
                            toast({
                                color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                                    && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013') + data.warningMsg
                            });/* 国际化处理： 取消支付成功*/
                            refreshHtml(that, props);
                        }
                        else if (data.successMsg) {
                            toast({
                                color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                                    && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013')
                            });/* 国际化处理： 取消支付成功*/
                            refreshHtml(that, props);
                        }
                    }
                }
            });
            break;
        // 刷新
        case 'refresh':
            refreshHtml(that, props);
            break;
        // 打印
        case 'print':
            let printData = props.table.getCheckedRows(this.tableId);
            let printpks = [];
            printData.forEach((item) => {
                printpks.push(item.data.values.pk_delivery_h.value);
            });
            print(
                //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                'pdf',
                '/nccloud/sf/delivery/deliveryprint.do',
                {
                    // printTemplateID: '1001Z61000000002AIOM',
                    //功能节点编码，即模板编码
                    // appcode: appcode,
                    //模板节点标识
                    nodekey: printnodekey,
                    // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                    oids: printpks,
                }
            );
            break;

        // 输出
        case 'output':
            let outputData = props.table.getCheckedRows(this.tableId);
            let outputpks = [];
            outputData.forEach((item) => {
                outputpks.push(item.data.values.pk_delivery_h.value);
            });
            output({
                url: '/nccloud/sf/delivery/deliveryprint.do',
                data: {
                    //功能节点编码，即模板编码
                    appcode: appcode,
                    // 模板节点标识
                    nodekey: printnodekey,
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
        //正式打印
        case 'officprint':
            elecSignPrint(props, true);
            break;
        //补充打印
        case 'supplyprint':
            elecSignPrint(props, false);
            break;
        // 附件管理
        case 'file':
            let accessoryBtnData = props.table.getCheckedRows(this.tableId);
            //单据pk
            let pk_delivery_hfile = '';
            //单据编号
            let bill_nofile = '';
            //选择一个或者不选择，多选默认显示空数据
            if (accessoryBtnData.length == 1) {
                accessoryBtnData.forEach((val) => {
                    if (val.data.values.pk_delivery_h && val.data.values.pk_delivery_h.value) {
                        pk_delivery_hfile = val.data.values.pk_delivery_h.value;
                    }
                    if (val.data.values.vbillno && val.data.values.vbillno.value) {
                        bill_nofile = val.data.values.vbillno.value;
                    }
                });
            } else {

            }
            // 
            this.setState({
                //单据pk
                billId: pk_delivery_hfile,
                //附件管理使用单据编号
                billno: bill_nofile,
                showUploader: !this.state.showUploader,
                target: null
            })
            break;
        // 联查
        // 	上收申请
        case 'linkapply':
            let linkapplyData = props.table.getCheckedRows(this.tableId);
            if (linkapplyData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
                });
                return;
            }
            if (linkapplyData[0].data.values.srcbusitype
                && linkapplyData[0].data.values.srcbusitype.value
                && linkapplyData[0].data.values.srcbusitype.value != '2') {
                /* 国际化处理： 单据不是上收申请生成的，无法联查上收申请!*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000031')
                });
                return;
            }

            let linkapply_pk_srcbill = linkapplyData[0].data.values.pk_srcbill;
            let linkapplywfExtParam = {
                status: 'browse',
                id: linkapply_pk_srcbill.value
            };
            linkApp(props, "36K3", linkapplywfExtParam);
            break;
        // 凭证
        case 'linkvoucher':
            let linkvoucherData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (linkvoucherData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
                });
                return;
            }
            let voucher_pk_h = linkvoucherData[0].data.values.pk_delivery_h.value;
            let voucher_pk_group = linkvoucherData[0].data.values.pk_group.value;
            let voucher_pk_org = linkvoucherData[0].data.values.pk_org.value;
            let voucher_pk_billtype = linkvoucherData[0].data.values.pk_billtype.value;
            let voucher_vbillno = linkvoucherData[0].data.values.vbillno.value;
            linkVoucherApp(props, voucher_pk_h, voucher_pk_group, voucher_pk_org, voucher_pk_billtype, voucher_vbillno);
            break;
        // 委托付款
        case 'linkpayment':
            let linkpaymentData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (linkpaymentData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }
            if (linkpaymentData[0].data.values.srcbusitype
                && linkpaymentData[0].data.values.srcbusitype.value
                && linkpaymentData[0].data.values.srcbusitype.value != '5') {
                /* 国际化处理： 单据不是上收回拨生成的，无法联查委托付款书!*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000033')
                });
                return;
            }
            let linkpaymentArr = [];
            let linkpayment_pk_srcbill;
            //处理选择数据
            linkpaymentData.forEach((val) => {
                if (val.data.values.pk_srcbill && val.data.values.pk_srcbill.value) {
                    let pk = val.data.values.pk_srcbill.value;
                    //主键
                    linkpaymentArr.push(pk);
                    linkpayment_pk_srcbill = pk;
                }
            });
            let linkpaymentwfExtParam = {
                status: 'browse',
                id: linkpayment_pk_srcbill
            };
            linkApp(props, "36J1", linkpaymentwfExtParam);
            break;
        // 回单
        case 'receipt':
            let receiptData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (receiptData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }
            if (receiptData[0].data.values.billstatus
                && receiptData[0].data.values.billstatus.value
                && receiptData[0].data.values.billstatus.value != 4) {
                /* 国际化处理： 请选择上收成功的单据进行操作!*/
                toast({
                    color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
                        && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000037')
                });
                return;
            }
            let receiptArr = [];
            //处理选择数据
            receiptData.forEach((val) => {
                // 转账成功
                if (val.data.values.billstatus && val.data.values.billstatus.value
                    && val.data.values.billstatus.value == 4) {
                    if (val.data.values.pk_delivery_h && val.data.values.pk_delivery_h.value) {
                        let pk = val.data.values.pk_delivery_h.value;
                        //主键
                        receiptArr.push(pk);
                    }
                }
            });
            let receiptExtParam = {
                status: 'browse',
                srcbillid: receiptArr,
                linkquerytype: 'LinkQuery_SrcBill_H',
            };
            linkApp(props, "36K9", receiptExtParam);
            break;
        // 计划预算
        case 'queryntbplan':
            let linkntbplanData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (linkntbplanData.length != 1) {
                /* 国际化处理： 请选择一条数据操作！*/
                toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028')
                });
                return;
            }
            let linkntbplanArr;
            //处理选择数据
            linkntbplanData.forEach((val) => {
                if (val.data.values.pk_delivery_h && val.data.values.pk_delivery_h.value) {
                    let pk = val.data.values.pk_delivery_h.value;
                    //主键
                    linkntbplanArr = pk;
                }
            });
            let queryntbplanData = {
                pk: linkntbplanArr,
                pageid: list_page_id,
            };
            ajax({
                url: '/nccloud/sf/delivery/deliverylinkplan.do',
                data: queryntbplanData,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.hint) {
                            toast({ color: 'warning', content: res.data.hint });
                            return;
                        } else {
                            this.setState({
                                showNtbDetail: true,
                                ntbdata: res.data
                            })
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
function refreshHtml(that, props) {
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    //查询condition
    let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;
    if (refreshsearchVal && refreshsearchVal.conditions) {
        setDefData(cachesearchKey, dataSourceLink, refreshsearchVal);
        let activeKeyState = that.state.activeKey;
        let billstatus = null;
        if (activeKeyState === '1') {
            billstatus = 6;
        } else if (activeKeyState === '2') {
            billstatus = 1;
        } else if (activeKeyState === '3') {
            billstatus = 2;
        }
        let data = {
            querycondition: refreshsearchVal,
            custcondition: {
                conditions: [
                    {
                        field: 'billstatus',
                        value: {
                            firstvalue: billstatus,
                            secondvalue: null
                        },
                        oprtype: '=',
                        datatype: 203,
                    }
                ],
                logic: "and",
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

        if (refreshsearchVal && refreshsearchVal.conditions) {
            ajax({
                url: '/nccloud/sf/delivery/deliveryquery.do',
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: 'success', content: loadMultiLang(props, '3601-000013')/**多语 刷新成功 */
                        });
                        if (data.grid) {
                            props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        } else {
                            props.table.setAllTableData(list_table_id, { rows: [] });
                        }
                        if (data.numvalues) {
                            that.setState({ numvalues: data.numvalues, activeKey: activeKeyState });
                            setDefData(cacheTabKey, dataSourceLink, that.state.numvalues);
                        } else {
                            that.setState({ numvalues: {} });
                        }
                    }
                }
            });
        }
    }
}

//电子签章打印
const elecSignPrint = function (props, offical) {
    elecSignListPrint(props, {
        url: url.common.elecsignprint,
        offical,
        appCode: appcode,
        nodeKey: offical ? printnodekey_offical : printnodekey_inoffical,
        tableCode: list_table_id,
        field_id: field.pk,
        validateFunc: (selectData) => {
            let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values[field.billstate] && selectData.data.values[field.billstate].value;
            if (state.billstate.payok != billstatus) {
                return loadMultiLang(props, '36320FDA--000123')/** 单据状态非转账成功！ */;
            }
            return null;
        }
    })
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/