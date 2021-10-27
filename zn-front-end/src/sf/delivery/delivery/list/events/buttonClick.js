/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, output, print, cardCache, promptBox,pageTo } from 'nc-lightapp-front';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { elecSignListPrint, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { payBeforeValidate } from "../../util/index";
import { BatchToast } from '../../../../pub/utils/messageUtil';
import {
    app_id, appcode, oid, printnodekey,
    list_page_id, list_search_id, list_table_id,
    cachesearchKey, dataSource, cacheTabKey,
    card_page_id, printnodekey_inoffical, printnodekey_offical, field, state, url
} from '../../cons/constant.js';

let { NCPopconfirm, NCIcon } = base;
let { deleteCacheId, getCacheById, updateCache, setDefData, getDefData } = cardCache;
let { NCMessage } = base;

async function buttonClick(props, id, checkData) {
    let pk = props.form.getFormItemsValue(this.formId, this.primaryId) && props.form.getFormItemsValue(this.formId, this.primaryId).value;
    let that = this;
    let selectedData = props.table.getCheckedRows(list_table_id);
    if (checkData) {
        selectedData = checkData;
    }
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
            /* 国际化处理： 请选择1条数据*/
            toast({
                color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                    && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000068')
            });
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
        tss: tsArr,
        pageid: list_page_id,
        pagecode:list_page_id//适配错误提示信息用
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
            // this.props.modal.show('delete');
            let deleteContent;
            if (selectedData.length > 1) {
                /* 国际化处理： 您确定要删除所选数据吗?*/
                deleteContent = this.props.MutiInit.getIntl("36320FDA")
                    && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000094');
            } else {
                /* 国际化处理： 确定要删除吗?*/
                deleteContent = this.props.MutiInit.getIntl("36320FDA")
                    && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000056');
            }
            promptBox({
                /* 国际化处理：删除*/
                title: this.props.MutiInit.getIntl("36320FDA")
                    && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000096'),
                color: "warning",
                content: deleteContent,
                beSureBtnClick: this.delConfirm.bind(this, props),
            });
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
                data: {
                    pks: dataArr,
                    tss: tsArr,
                    pageid: list_page_id,
                    //适配错误提示信息用
                    btncode:"commit",
                    pagecode:list_page_id
                },
                success: (res) => {
                    let data = res.data;
                    if (res.success) {
                        if (res.data.workflow &&
                            (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                            this.setState({
                                compositedata: res.data,
                                compositedisplay: true,
                            });
                        } else {
                            // if(res.data.warningMsg){
                            //     toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007')+res.data.warningMsg });/* 国际化处理： 提交成功*/
                            // }else{
                            //     toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });/* 国际化处理： 提交成功*/
                            // }
                            // refreshHtml(that, props);
                            if (data.interactMsg) {

                            } else {
                                let successIndexs = 0, failIndexs = 0;
                                if (res.data.successpks) {
                                    successIndexs = res.data.successpks.length;
                                }
                                failIndexs = selectedData.length - successIndexs;
                                // 全部成功
                                if (failIndexs == 0) {
                                    BatchToast('commit', 1, selectedData.length, successIndexs, failIndexs, null, null, that);
                                }
                                // 全部失败
                                else if (selectedData.length == failIndexs) {
                                    BatchToast('commit', 0, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                                }
                                // 部分成功
                                else if (failIndexs > 0) {
                                    BatchToast('commit', 2, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                                }
                            }
                        }
                    }
                    if (res.data.grid) {
                        handleReturnData(that, selectedData, res.data.grid);
                    }
                }
            });
            break;
        // 收回
        case 'uncommit':
            ajax({
                url: '/nccloud/sf/delivery/deliveryuncommit.do',
                data:{
                    pks: dataArr,
                    tss: tsArr,
                    pageid: list_page_id,
                    //适配错误提示信息用
                    btncode:"uncommit",
                    pagecode:list_page_id
                },
                success: (res) => {
                    let data = res.data;
                    if (res.success) {
                        if (res.data && res.data.errorMsg) {
                            // toast({ color: 'warning', content: res.data.errorMsg });
                        }
                        else if (res.data.warningMsg) {
                            // toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008')+res.data.warningMsg });/* 国际化处理： 提交成功*/
                        } else {
                            // toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008') });/* 国际化处理： 收回成功*/
                        }
                        // refreshHtml(that, props);
                        if (res.data.grid) {
                            handleReturnData(that, selectedData, res.data.grid);
                        }
                        if (data.interactMsg) {

                        } else {
                            let successIndexs = 0, failIndexs = 0;
                            if (res.data.successpks) {
                                successIndexs = res.data.successpks.length;
                            }
                            failIndexs = selectedData.length - successIndexs;
                            // 全部成功
                            if (failIndexs == 0) {
                                BatchToast('uncommit', 1, selectedData.length, successIndexs, failIndexs, null, null, that);
                            }
                            // 全部失败
                            else if (selectedData.length == failIndexs) {
                                BatchToast('uncommit', 0, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                            }
                            // 部分成功
                            else if (failIndexs > 0) {
                                BatchToast('uncommit', 2, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                            }
                        }
                    }
                }
            });
            break;
        // 退回
        case 'back':
            // props.modal.show('backModel',{
            //     //点击确定按钮事件
            //     beSureBtnClick: buttonClick.bind(this, props, 'backconfirm')
            // });
            this.setState({
                showBackModal: true
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
                pageid: list_page_id,
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
                                const selecteBackData = this.props.table.getCheckedRows(list_table_id);
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
                        // refreshHtml(that, props);
                        if (res.data.grid) {
                            handleReturnData(that, selectedData, res.data.grid);
                        }
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
                        // refreshHtml(that, props);
                        if (res.data.grid) {
                            handleReturnData(that, selectedData, res.data.grid);
                        }
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
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
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
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
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
                        this.setState({
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
            let pay_pks = [], pay_tss = [], ismendinfofull_pays = [];
            //处理选择数据
            selectedData.forEach((val) => {
                pay_pks.push(val.data.values.pk_delivery_h.value);
                //ts时间戳
                pay_tss.push(val.data.values.ts.value);
                ismendinfofull_pays.push(val.data.values.ismendinfofull.value);
            });
            let payData = {
                pks: pay_pks,
                tss: pay_tss,
                pageid: list_page_id,
            }
            if (selectedData.length > 1) {
                pay(that, props, selectedData);
            } else {
                let payBeforeData = await payBeforeValidate(this.props, payData);
                if (payBeforeData) {
                    if (payBeforeData.errorMsg) {
                        toast({ color: 'warning', content: payBeforeData.errorMsg });
                        return;
                    }
                    else if (payBeforeData.interactMsg) {
                        promptBox({
                            color: "warning",
                            content: payBeforeData.interactMsg,
                            //点击确定按钮事件
                            beSureBtnClick: buttonClick.bind(this, props, 'payBtnConfirm', selectedData),
                        });
                    }
                    else if (payBeforeData.successMsg) {
                        pay(that, props, selectedData);
                    }
                }
            }
            break;
        // 支付确认
        case 'payBtnConfirm':
            // if (selectedData.length != 1) {
            //      /* 国际化处理： 请选择一条数据操作！*/
            //      toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
            //      && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070') });
            //     return;
            // }
            let payBtnConfirm_pks = [], payBtnConfirm_tss = [], ismendinfofull_payBtnConfirms = [];
            //处理选择数据
            selectedData.forEach((val) => {
                payBtnConfirm_pks.push(val.data.values.pk_delivery_h.value);
                //ts时间戳
                payBtnConfirm_tss.push(val.data.values.ts.value);
                ismendinfofull_payBtnConfirms.push(val.data.values.ismendinfofull.value);
            });
            let isKey_payBtnConfirm = false;
            for (let index = 0; index < ismendinfofull_payBtnConfirms.length; index++) {
                const ismendinfofull_payBtnConfirm = ismendinfofull_payBtnConfirms[index];
                if (ismendinfofull_payBtnConfirm) {
                    isKey_payBtnConfirm = true;
                    // return;
                }
            }
            let payBtnConfirmresult = await Sign({
                isSign: true,
                isKey: isKey_payBtnConfirm,
                data: null,
                encryptVOClassName: null,
                primaryId: payBtnConfirm_pks,
            });
            if (payBtnConfirmresult.isStop) {
                return;
            } else {
                let payBtnConfirmData = {
                    pks: payBtnConfirm_pks,
                    tss: payBtnConfirm_tss,
                    pageid: list_page_id,
                    operator: 1,
                    sign_strSrc: payBtnConfirmresult.data.text,
                    signature: payBtnConfirmresult.data.signText,
                    sing_sn: payBtnConfirmresult.data.userjson,
                }
                ajax({
                    url: '/nccloud/sf/delivery/deliverypay.do',
                    data: payBtnConfirmData,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            let successIndexs = 0, failIndexs = 0;
                            if (res.data.successpks) {
                                successIndexs = res.data.successpks.length;
                            }
                            failIndexs = selectedData.length - successIndexs;
                            // 全部成功
                            if (failIndexs == 0) {
                                BatchToast('pay', 1, selectedData.length, successIndexs, failIndexs, null, null, that);
                            }
                            // 全部失败
                            else if (selectedData.length == failIndexs) {
                                BatchToast('pay', 0, selectedData.length, successIndexs, failIndexs, data.errorMsg.split('\n'), null, that);
                            }
                            // 部分成功
                            else if (failIndexs > 0) {
                                BatchToast('pay', 2, selectedData.length, successIndexs, failIndexs, data.errorMsg.split('\n'), null, that);
                            }
                            if (res.data.grid) {
                                handleReturnData(that, selectedData, res.data.grid);
                            }
                        }
                    }
                });
            }
            break;
        // 取消支付
        case 'unpay':
            let unpay_pk = [], unpay_ts = [];
            //处理选择数据
            selectedData.forEach((val) => {
                unpay_pk.push(val.data.values.pk_delivery_h.value);
                //ts时间戳
                unpay_ts.push(val.data.values.ts.value);
            });
            let unpayData = {
                pks: unpay_pk,
                tss: unpay_ts,
                pageid: list_page_id,        
                //适配错误提示信息用
                btncode:"pay",
                pagecode:list_page_id
            }
            ajax({
                url: '/nccloud/sf/delivery/deliveryunpay.do',
                data: unpayData,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.errorMsg) {
                            // toast({ color: 'warning', content: data.errorMsg });
                            // refreshHtml(that, props);
                        }
                        else if (data.warningMsg) {
                            // toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") 
                            // && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013')+data.warningMsg });/* 国际化处理： 取消支付成功*/
                            // refreshHtml(that, props);
                        }
                        else if (data.successMsg) {
                            // toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") 
                            // && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013') });/* 国际化处理： 取消支付成功*/
                            // refreshHtml(that, props);
                        }
                        if (res.data.grid) {
                            handleReturnData(that, selectedData, res.data.grid);
                        }
                        if (data.interactMsg) {

                        } else {
                            let successIndexs = 0, failIndexs = 0;
                            if (res.data.successpks) {
                                successIndexs = res.data.successpks.length;
                            }
                            failIndexs = selectedData.length - successIndexs;
                            // 全部成功
                            if (failIndexs == 0) {
                                BatchToast('unpay', 1, selectedData.length, successIndexs, failIndexs, null, null, that);
                            }
                            // 全部失败
                            else if (selectedData.length == failIndexs) {
                                BatchToast('unpay', 0, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                            }
                            // 部分成功
                            else if (failIndexs > 0) {
                                BatchToast('unpay', 2, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                            }
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
            let printData = props.table.getCheckedRows(list_table_id);
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
                    appcode: appcode,
                    //模板节点标识
                    nodekey: printnodekey,
                    // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                    oids: printpks,
                }
            );
            break;

        // 输出
        case 'output':
            let outputData = props.table.getCheckedRows(list_table_id);
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
            let accessoryBtnData = props.table.getCheckedRows(list_table_id);
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
            let linkapplyData = props.table.getCheckedRows(list_table_id);
            //数据校验
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
            let linkvoucherData = props.table.getCheckedRows(list_table_id);
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

            //联查内贷还本  
            case 'linkndpayment':
            debugger;
            if(selectedData.length != 1) {
                // toast({color:'warning',content:loadMultiLang(this.props, '36320FA-000081')})/*国际化处理：请选择一条数据进行联查! */
                       toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
                });
                return;
            }
            let srcbillno = selectedData[0].data.values['vuserdef1'].value;
            // console.log(srcbillno.value);   
            pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/card", {
                status: "browse",
                id: srcbillno,
                appcode: "36360IRP",
                pagecode: "36360IRP_CARD",
                scene: "linksce"
            });
            break;

            case 'toNDHB':
            if(parseFloat(vuserdef5)>parseFloat(totalamount)){
                toast({
                    color: 'warning',
                    content:loadMultiLang(this.props, '36320FDA--0000125')
                });
                return;
                }
                let sourceid = data.pk;//来源主键
                debugger;
                this.props.openTo('/icdmc/icdmc/repayprcpl/main/index.html#/card', 
                    {
                        srcFunCode:'36360IRP',
                        appcode: '36360IRP',
                        pagecode: '36360IRP_CARD',                   
                        status: 'add',
                        sourceid:sourceid
                    });





        //内贷还本列表联查内贷付息
        case 'linkndinterest':
            debugger;
            if(selectedData.length != 1) {
                // toast({color:'warning',content:loadMultiLang(this.props, '36320FA-000081')})/*国际化处理：请选择一条数据进行联查! */
                       toast({
                    color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                        && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070')
                });
                return;
            }
            let pk_repayintsticdmc = selectedData[0].data.values['vbillno'].value;
            props.openTo("/icdmc/icdmc/repayintst/main/index.html#/card", {
              status: "browse",
              id: pk_repayintsticdmc,
              appcode: "36360IPI",
              pagecode: "36360IPI_CARD",
              scene: "linksce"
          });
            break;

            
        // 委托付款
        case 'linkpayment':
            let linkpaymentData = props.table.getCheckedRows(list_table_id);
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
            let receiptData = props.table.getCheckedRows(list_table_id);
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
            let linkntbplanData = props.table.getCheckedRows(list_table_id);
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

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectedData, data) {
    let returnData = data[list_table_id].rows;
    //处理选择数据
    selectedData.forEach((val) => {
        let pk_delivery_h_check = val.data.values.pk_delivery_h.value;
        returnData.forEach((retrunval) => {
            if (pk_delivery_h_check === retrunval.values.pk_delivery_h.value) {
                let updateDataArr = [{
                    index: val.index,
                    data: { values: retrunval.values }
                }];
                that.props.table.updateDataByIndexs(list_table_id, updateDataArr);
            }
        });
    });
}

//刷新列表信息
function refreshHtml(that, props) {
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    //查询condition
    // let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    let refreshsearchVal = getDefData(cachesearchKey, dataSource);
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;
    if (refreshsearchVal && refreshsearchVal.conditions) {
        setDefData(cachesearchKey, dataSource, refreshsearchVal);
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
            pagecode: list_page_id,
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
                            // that.setState({ numvalues: data.numvalues, activeKey: 6 });
                            that.setState({ numvalues: data.numvalues, activeKey: activeKeyState });
                            setDefData(cacheTabKey, dataSource, that.state.numvalues);
                        } else {
                            that.setState({ numvalues: {} });
                        }
                    }
                }
            });
        }
    }
}

/**
 * 支付
 * @param {*} that 
 * @param {*} props 
 * @param {*} selectedData 
 */
async function pay(that, props, selectedData) {
    let pay_pks = [], pay_tss = [], ismendinfofull_pays = [];
    //处理选择数据
    selectedData.forEach((val) => {
        pay_pks.push(val.data.values.pk_delivery_h.value);
        //ts时间戳
        pay_tss.push(val.data.values.ts.value);
        ismendinfofull_pays.push(val.data.values.ismendinfofull.value);
    });

    let isKey_pay = false;
    for (let index = 0; index < ismendinfofull_pays.length; index++) {
        if (ismendinfofull_pays[index]) {
            isKey_pay = true;
            break;
        }
    }
    let payresult = await Sign({
        isSign: true,
        isKey: isKey_pay,
        data: null,
        encryptVOClassName: null,
        primaryId: pay_pks
    });
    if (payresult.isStop) {
        return;
    }
    // console.log(payresult.data);
    let payData = {
        pks: pay_pks,
        tss: pay_tss,
        pageid: list_page_id,
        sign_strSrc: payresult.data.text,
        signature: payresult.data.signText,
        sing_sn: payresult.data.userjson,
        //适配错误提示信息用
        btncode:"pay",
        pagecode:list_page_id
        
    }
    ajax({
        url: '/nccloud/sf/delivery/deliverypay.do',
        data: payData,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data.interactMsg) {
                    promptBox({
                        color: "warning",
                        content: data.interactMsg,
                        //点击确定按钮事件
                        // beSureBtnClick: buttonClick.bind(this, props ,'payBtnConfirm', selectedData),
                        beSureBtnClick: () => buttonClick.call(that, props, 'payBtnConfirm', selectedData),
                    });
                } else {
                    let successIndexs = 0, failIndexs = 0;
                    if (res.data.successpks) {
                        successIndexs = res.data.successpks.length;
                    }
                    failIndexs = selectedData.length - successIndexs;
                    // 全部成功
                    if (failIndexs == 0) {
                        BatchToast('pay', 1, selectedData.length, successIndexs, failIndexs, null, null, that);
                    }
                    // 全部失败
                    else if (selectedData.length == failIndexs) {
                        BatchToast('pay', 0, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                    }
                    // 部分成功
                    else if (failIndexs > 0) {
                        BatchToast('pay', 2, selectedData.length, successIndexs, failIndexs, data.errorMsg && data.errorMsg.split('\n'), null, that);
                    }
                    if (res.data.grid) {
                        handleReturnData(that, selectedData, res.data.grid);
                    }
                }
            }
        }
    });
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

export default buttonClick;
/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/