/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
//结算
import { ajax, toast, cacheTools, print, promptBox } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import {
    sourceModel_CMP, SHOWMODEL_BULU,
    SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU,
    PAYMODEL_COMBINEPAY,
    commondata, getappurl
} from '../../../../public/utils/constant';
import Sign from '../../../../../tmpub/pub/util/ca';
import { makebillBtn } from '../buttonClick/makebillBtn.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from "../../../../../tmpub/pub/util/LinkUtil.js";
import { linkApproveBtn } from '../buttonClick/linkApproveBtn.js';
import appBase from '../../../base'
import api from '../../../base/api';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
/**
 * [结算]-列表表头按钮事件
 * @param {*} props 
 * @param {*} id 
 */
export default async function buttonClick(props, id) {
    let self = this;
    if ('refreshBtn' == id) {
        self.refreshBtn();
        return;
    }
    let selectedData = props.table.getCheckedRows(this.tableId);
    let pks = [];
    let tss = [];
    if (!selectedData || selectedData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000020') });/* 国际化处理： 请选择数据*/
        return;
    }
    if (selectedData && selectedData.length == 1) {
        let trade_code = null;
        selectedData.forEach((val) => {
            trade_code = val.data.values.tradertypecode.value;//业务单据类型
        });
        self.setState({
            tradecode: trade_code,
        });
    }

    //处理选择数据
    let pktsmap = {};
    selectedData.forEach((val) => {
        //此处可校验，挑选满足条件的进行操作
        let pk = val.data.values.pk_settlement.value;
        let ts = val.data.values.ts.value;
        pks.push(pk);//主键数组
        tss.push(ts);
        pktsmap[pk] = ts;
    });
    let data = {
        pks: pks,
        tss: tss,
        pktsmap: pktsmap,
        pagecode: Templatedata.list_pageid

    };
    let error = [];
    let indexs = [];
    switch (id) {
        //小应用按钮
        case 'signBtn':
            // //签字,需要校验是否是已审批状态的
            pks = [];
            tss = [];
            pktsmap = {};
            selectedData.forEach((val) => {
                // 业务单据审批状态
                let aduitstatus = val.data.values.aduitstatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                if (!pk_signer && aduitstatus == 0) {
                    // 签字人为空，且业务单据状态为已审批
                    //此处可校验，挑选满足条件的进行操作
                    let pk = val.data.values.pk_settlement.value;
                    let ts = val.data.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    indexs.push(val.index);
                    pktsmap[pk] = ts;
                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            if (pks && pks.length == 0) {
                if (error.length > 0) {
                    let before = this.getLangCode('000029');/* 国际化处理： 单据编号 */
                    let after = this.getLangCode('000030');/* 国际化处理：  不可签字！*/
                    let errmessages = [];

                    for (let index = 0; index < error.length; index++) {
                        const val = error[index];
                        let errmessage = before + val + after;
                        errmessages.push(errmessage);
                    }
                    self.settlementBatchToast(commondata.SIGN, 0, error.length, errmessages);

                } else {
                    toast({ color: 'warning', content: this.getLangCode('000031') });/* 国际化处理： 您选择的数据不可签字*/
                }
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            // ajax({
            //     url: Templatedata.settlesign,
            //     data: data,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {
            //             if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
            //                 // 后台有返回错误信息
            //                 let errmsg = data.message.errmsg;
            //                 let errlength = errmsg.length + error.length;
            //                 let succlength = pks.length - errmsg.length;
            //                 self.settlementBatchToast(commondata.SIGN, succlength, errlength, errmsg);
            //             } else {
            //                 // 传到后台的全部成功了,需要构造错误信息数组[]
            //                 let errlength = error.length;
            //                 let succlength = pks.length;
            //                 self.settlementBatchToast(commondata.SIGN, succlength, errlength, []);
            //                 // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
            //             }
            //             self.refreshByData(indexs, data);
            //         }
            //     }
            // });
            batchSignAction.call(this, this.props, {
                data,
                pks,
                indexs,
                error,
                callback: (res) => {
                    return api.tbbAlarmConfim({
                        props: this.props, data, res, confirm: (data) => {
                            batchSignAction.call(this, this.props, { data, pks, indexs, error });
                        }
                    })
                }
            });
            //end tangleic 20200108
            break;

        //delete
        case 'antiSignBtn':
            //取消签字
            // 需要校验是否可以取消签字
            pks = [];
            tss = [];
            pktsmap = {};
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.data.values.settlestatus.value;
                let settletype = val.data.values.settletype.value;
                let systemcode = val.data.values.systemcode.value;
                let antiSignFlag = systemcode == '2' || systemcode == '5' || settletype == '11' ? true : false;
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                // 修改列表肩部判断逻辑，使用后端的判断，前端判断不准确，结算成功，来源于到账通知或者资金结算等都可取消签字 
                if ((settlestatus == '0' || antiSignFlag) && pk_signer) {

                    // 结算状态为未结算'0'为未结算，且签字人不为空
                    //此处可校验，挑选满足条件的进行操作
                    let pk = val.data.values.pk_settlement.value;
                    let ts = val.data.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    indexs.push(val.index);
                    pktsmap[pk] = ts;
                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            if (pks && pks.length == 0) {
                if (error.length > 0) {
                    let before = this.getLangCode('000029');/* 国际化处理： 单据编号 */
                    let after = this.getLangCode('000033');/* 国际化处理：  不可取消签字！*/
                    let errmessages = [];

                    for (let index = 0; index < error.length; index++) {
                        const val = error[index];
                        let errmessage = before + val + after;
                        errmessages.push(errmessage);
                    }
                    self.settlementBatchToast(commondata.UNSIGN, 0, error.length, errmessages);

                } else {
                    toast({ color: 'warning', content: this.getLangCode('000034') });/* 国际化处理： 您选择的数据不可取消签字*/
                }
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            // ajax({
            //     url: Templatedata.settleantisign,
            //     data: data,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {
            //             if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
            //                 // 后台有返回错误信息
            //                 let errmsg = data.message.errmsg;
            //                 let errlength = errmsg.length + error.length;
            //                 let succlength = pks.length - errmsg.length;
            //                 self.settlementBatchToast(commondata.UNSIGN, succlength, errlength, errmsg);
            //             } else {
            //                 // 传到后台的全部成功了,需要构造错误信息数组[]
            //                 let errlength = error.length;
            //                 let succlength = pks.length;
            //                 self.settlementBatchToast(commondata.UNSIGN, succlength, errlength, []);
            //                 // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
            //             }
            //             self.refreshByData(indexs, data);
            //         }
            //     }
            // });
            batchUnSingAction.call(this, this.props, {
                data,
                pks,
                indexs,
                error,
                callback: (res) => {
                    return api.tbbAlarmConfim({
                        props: this.props, data, res, confirm: (data) => {
                            batchUnSingAction.call(this, this.props, { data, pks, indexs, error });
                        }
                    })
                }
            });
            //end tangleic
            break;

        //结算
        case 'settleBtn':
            appBase.api.multiDataDuplicatePayCheck(this.props,
                {
                    tableCode: this.tableId,
                    confirm: settlement.bind(this, { selectedData, indexs, error, self, data, pks, tss, pktsmap })
                });
            break;
        // 合并结算
        case 'combinsettleBtn':
            pks = [];
            tss = [];
            pktsmap = {};
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.data.values.settlestatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                if (settlestatus == '0' && pk_signer) {
                    // 结算状态为未结算'0'为未结算，且签字人不为空，可以进行结算操作
                    let pk = val.data.values.pk_settlement.value;
                    let ts = val.data.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    indexs.push(val.index);
                    pktsmap[pk] = ts;
                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            if (pks && pks.length <= 1) {
                toast({ color: 'warning', content: this.getLangCode('000038') });/* 国际化处理： 请选择至少两条可以合并结算的数据*/
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settlecombinsettle,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.errmsg) {
                            if (error.length > 0) {
                                toast({
                                    color: 'warning', content:
                                        (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))/* 国际化处理： 单据编号 */
                                        + error.join(', ')
                                        + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000039'))
                                });/* 国际化处理：  不可合并结算！*/
                            } else {
                                // toast({ color: 'warning', content: data.errmsg });
                            }
                            // 刷新当前页
                            // self.refreshPks();
                            self.refreshByData(indexs, data);
                        }
                    }
                }
            });
            break;
        //取消结算
        case 'antiSettleBtn':
            pks = [];
            tss = [];
            pktsmap = {};
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.data.values.settlestatus && val.data.values.settlestatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer && val.data.values.pk_signer.value;
                if (pk_signer && settlestatus != '0') { // settlestatus!='0'
                    // 结算状态为未结算'0'为未结算，不是未结算状态且签字人不为空，可以进行取消结算操作
                    // 取消结算有可能数据是多子表部分成功，部分不成功的，
                    // 此时主表还是未结算，去除这种校验，在后台进行校验
                    let pk = val.data.values.pk_settlement.value;
                    let ts = val.data.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    pktsmap[pk] = ts;
                    indexs.push(val.index);
                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            //begin tm lidyu 取消結算去掉校驗  防止多表体有结算成功的单据却无法取消结算 20200402
            // if (pks && pks.length == 0) {
            //     if (error.length > 0) {
            //         // toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029')/* 国际化处理： 单据编号 */
            //         //                 +error.join(', ')+this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000040') });/* 国际化处理：  不可取消结算！*/
            //         // let billnos = error.join(', ');
            //         let before = this.getLangCode('000029')/* 国际化处理： 单据编号 */
            //         let after = this.getLangCode('000040');/* 国际化处理：  不可取消结算！*/
            //         let errmessages = [];

            //         for (let index = 0; index < error.length; index++) {
            //             const val = error[index];
            //             let errmessage = before + val + after;
            //             errmessages.push(errmessage);
            //         }
            //         self.settlementBatchToast(commondata.UNSETTLE, 0, error.length, errmessages);

            //     } else {
            //         toast({ color: 'warning', content: this.getLangCode('000041') });/* 国际化处理： 您选择的数据不可取消结算*/
            //     }
            //     return;
            // }
            //end tm lidyu 取消結算去掉校驗  20200402
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settleantisettle,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                            // 后台有返回错误信息
                            let errmsg = data.message.errmsg;
                            let errlength = errmsg.length + error.length;
                            let succlength = pks.length - errmsg.length;

                            self.settlementBatchToast(commondata.UNSETTLE, succlength, errlength, errmsg);
                            //toast({ color: 'warning', content: data.message.errmsg });
                        } else {
                            // 传到后台的全部成功了,需要构造错误信息数组[]
                            let errlength = error.length;
                            let succlength = pks.length;
                            self.settlementBatchToast(commondata.UNSETTLE, succlength, errlength, []);
                            // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
                        }
                        self.refreshByData(indexs, data);
                    }
                }
            });
            break;
        //委托办理
        case 'commitToFTSBtn':
            // 控制只能选择一条数据
            if (selectedData && selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000012') });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            // 此处校验什么状态的单据才可以进行委托办理
            // 现在还不知道什么状态的单据可以进行委托办理
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.data.values.settlestatus && val.data.values.settlestatus.value;
                // 业务单据状态 '8'表示签字态
                let busistatus = val.data.values.busistatus && val.data.values.busistatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer && val.data.values.pk_signer.value;
                if (pk_signer && settlestatus == '0') {
                    // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付

                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            if (error && error.length > 0) {
                let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                    + error.join(', ')
                    + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000070'));/* 国际化处理： 单据编号 , 不可进行委托办理操作！*/
                toast({ color: 'warning', content: content });
                return;
            }
            // 委托办理需要强制CA校验
            // 强制弹框输入密码
            //tm lidyu begin 结算委托办理加CA验签代码回退
            let result = await Sign({
                data: null,
                encryptVOClassName: null,
                isSign: false,
                isKey: true,
            })
            // lidyu end 
            if (result.isStop) {
                return;
            }
            ajax({
                url: Templatedata.settlecommit,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000004') });/* 国际化处理： 委托办理成功*/
                        // 刷新当前页
                        self.refreshPks();
                    }
                }
            });
            break;
        // 取消委托
        case 'cancelCommitToFTSBtn':
            // 取消委托需要控制只有一条数据
            // 取消委托不需要强制输入密码
            if (selectedData && selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000012') });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            pks = [];
            tss = [];
            pktsmap = {};
            // 此处校验什么状态的单据才可以进行委托办理
            // 现在还不知道什么状态的单据可以进行委托办理
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.data.values.settlestatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                if (pk_signer && settlestatus != '5') {
                    // 结算状态为已结算的不可进行取消委托办理；‘5’为结算成功
                    let pk = val.data.values.pk_settlement.value;
                    let ts = val.data.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    indexs.push(val.index);
                    pktsmap[pk] = ts;
                } else {
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            })
            if (error && error.length > 0) {
                let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                    + error.join(', ')
                    + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000071'));/* 国际化处理： 单据编号 , 不可进行取消委托办理操作！*/
                toast({ color: 'warning', content: content });
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settlecancelcommit,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000065') });/* 国际化处理： 取消委托办理成功*/
                        // 刷新当前页
                        self.refreshPks();
                    }
                }
            });
            break;


        /*******支付组 */
        //网上转账
        case 'netpayBtn':
            //begin tm tangleic 20190627 将原有的按钮处理逻辑封装成方法netPay 网上转账前对重复支付的数据做检查
            appBase.api.multiDataDuplicatePayCheck(this.props,
                {
                    tableCode: this.tableId,
                    confirm: netPay.bind(this, { selectedData, data, error, self })
                });
            //end tangleic 
            break;
        //合并支付
        case 'combinpayBtn':
            //toast({ color: 'warning', content: '功能待开发' });
            //this.state.modelType = PAYMODEL_COMBINEPAY;

            //begin tm tangleic 20190627 将原有按钮处理逻辑封装成方法combinePay 合并支付对重复支付的数据进行检查
            appBase.api.multiDataDuplicatePayCheck(this.props,
                {
                    tableCode: this.tableId,
                    confirm: commbinePay.bind(this, { data })
                });
            //end tangleic
            break;
        //补录网银信息
        case 'preparenetBtn':
            //toast({ color: 'warning', content: '功能待验证' }); 
            //this.state.modelType = SHOWMODEL_BULU;
            // 控制只能选择一条数据
            if (selectedData && selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000012') });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            this.setState({
                modelType: SHOWMODEL_BULU,
                modalValue: SHOWMODEL_BULU
            }, () => {
                this.loadBuLuInfo(data);
            });
            break;
        //结算红冲
        case 'redHandleBtn':
            // 先校验再提示模态框
            if (!selectedData || selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000042') });/* 国际化处理： 请选择1条数据*/
                return;
            }
            //处理选择数据
            let redpks = [];
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                // 结算失败的才可进行结算红冲操作
                // 结算状态为支付失败的单据才可以进行红冲操作
                let settlestatus = val.data.values.settlestatus.value;
                // 2为支付失败单据,6为部分成功的单据
                if (settlestatus == '2' || settlestatus == '6') {
                    let pk = val.data.values.pk_settlement.value;
                    // 主键数组
                    redpks.push(pk);
                } else {
                    error.push(val.data.values.billcode.value);
                }
            });
            if (redpks.length == 0) {
                let content = this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000043');/* 国际化处理： 您选择的数据不可进行红冲操作！*/
                if (error.length != 0) {
                    content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                        + error.join(', ')
                        + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000044'))/* 国际化处理： 单据编号 , 不可进行红冲操作！*/
                }
                toast({ color: 'warning', content: content });
                return;
            }
            // this.props.modal.show('redHandleModal');//舍弃写法
            promptBox({
                color: "warning",
                title: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000022'),/* 国际化处理： 结算红冲*/
                content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000023'),/* 国际化处理： 结算红冲操作不可逆,确定是否继续?*/
                beSureBtnClick: this.redHandleProcess.bind(this), //使用call直接執行了
            });

            break;
        case 'settlePayChangeBtn':
            //支付变更，需要选择子表数据，在卡片页有
            break;
        /**联查组 */
        //联查单据
         case 'linkQueryBillBtn':
         //begin tm lidyu 添加一个后端校验 到账通知生成的结算单不支持联查单据 20200415
         ajax({
            url: Templatedata.linkvalidate,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let linkquerybillData = props.table.getCheckedRows(this.tableId);
                    //数据校验
                    if (linkquerybillData.length != 1) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000006') });/* 国际化处理： 请选择单条数据，联查单据!*/
                        return;
                    }
                    //处理选择数据
                    let showbilltrackpk;
                    let billtrack_billtype;
                    linkquerybillData.forEach((val) => {
                        //1909支持网问题：联查单据报：鉴权错误
                        let pk_busibill = val.data.values.pk_busibill && val.data.values.pk_busibill.value;
                        let pk_billtype = val.data.values.pk_billtype && val.data.values.pk_billtype.value;
                        if (pk_busibill) {
                            showbilltrackpk = pk_busibill;
                        } else {
                            showbilltrackpk = val.data.values.pk_settlement && val.data.values.pk_settlement.value;
                        }
                        if (pk_billtype) {
                            billtrack_billtype = pk_billtype;
                        } else {
                            billtrack_billtype = val.data.values.settlebilltype && val.data.values.settlebilltype.value;
                        }
                    });
                    if (showbilltrackpk) {
                        self.setState({
                            showbilltrack: true,                    //显示联查单据
                            showbilltracktype: billtrack_billtype,  //单据类型
                            showbilltrackpk: showbilltrackpk        //单据pk
                        });
                    }
                }
           
            }
        });  
      
            break;
        //联查凭证,验证已跳转
        case 'linkVoucherBtn':
            // toast({ color: 'info', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000007') });/* 国际化处理： 联查凭证*/

            let val = selectedData[0];
            let pk_group, pkorg, pk_busibill, pk_billtype, billcode
            if (val.data.values.pk_group && val.data.values.pk_group.value != null) {
                pk_group = val.data.values.pk_group.value;
            }
            if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
                pkorg = val.data.values.pk_org.value;
            }
            // 业务单据id
            if (val.data.values.pk_busibill && val.data.values.pk_busibill.value != null) {
                pk_busibill = val.data.values.pk_busibill.value;
            }
            // 业务单据类型<有交易类型优先传递>
            if (val.data.values.pk_tradetype && val.data.values.pk_tradetype.value != null) {
                pk_billtype = val.data.values.pk_tradetype.value;
            } else if (val.data.values.pk_billtype && val.data.values.pk_billtype.value != null) {
                pk_billtype = val.data.values.pk_billtype.value;
            }
            // 业务单据编号
            if (val.data.values.billcode && val.data.values.billcode.value != null) {
                billcode = val.data.values.billcode.value;
            }
            //来源系统<报销单生成单据独有，否则后台查询凭证查不到,因为报销单生成凭证pk重新定义了>
            let settle_pk = val.data.values.pk_settlement && val.data.values.pk_settlement.value;
            let exParam = {
                freedef4: settle_pk//费用单据联查拼争额外参数
            }
            console.log('link_source:', exParam);
            /**
             * 联查凭证小应用
             * @param {*} props 页面内置对象
             * @param {*} billID 单据主键
             * @param {*} pk_group 集团
             * @param {*} pk_org 组织
             * @param {*} billOrTransType 单据类型或交易类型
             * @param {*} billNO 单据编号
             */
            linkVoucherApp(
                props,
                pk_busibill,
                pk_group,
                pkorg,
                pk_billtype,
                billcode,
                exParam
            )
            break;
        //联查余额
        case 'linkRestMoneyBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000045') });/* 国际化处理： 联查余额列表页不支持*/
            return;

            let buybalanceBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (buybalanceBtnData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000042') });/* 国际化处理： 请选择1条数据*/
                return;
            }

            let buybalanceBtnArr = [];
            //处理选择数据
            buybalanceBtnData.forEach((val) => {

                if (val.data.values.pk_buyacct && val.data.values.pk_buyacct.value != null) {
                    let pk_buyacct = val.data.values.pk_buyacct.value;
                    buybalanceBtnArr.push(pk_buyacct);//买入银行账号
                }

            });
            cacheTools.set('initMoney_PubSearch', buybalanceBtnArr);
            window.parent.openNew({ code: '360701OBP', name: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000046'), pk_appregister: '0001Z61000000003AULD' }, null, /* 国际化处理： 期初余额联查*/
                'status=browse&src=exchange')
            break;
        //联查网银信息
        case 'linkNetBankBtn':
            //toast({ color: 'warning', content: '功能待开发' });
            // 联查网银信息就是浏览网银补录信息
            if (!selectedData || selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000042') });/* 国际化处理： 请选择1条数据*/
                return;
            }
            //处理选择数据
            let netpks = [];
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作

                let settlestatus = val.data.values.settlestatus.value;
                // 0为未结算，未结算的不准联查网银信息
                if (settlestatus == '0') {
                    error.push(val.data.values.billcode.value);
                } else {
                    let pk = val.data.values.pk_settlement.value;
                    // 主键数组
                    netpks.push(pk);
                }
            });
            if (netpks.length == 0) {
                let content = '';
                if (error.length != 0) {
                    content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                        + error.join(', ')
                        + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000079'))/* 国际化处理： 单据编号 , 没有网银信息！*/
                }
                toast({ color: 'warning', content: content });
                return;
            }
            this.setState({
                modelType: SHOWMODEL_LIULAN,
                modalValue: SHOWMODEL_LIULAN
            }, () => {
                this.loadBuLuInfo(data);
            });
            break;
        //联查支付确认单
        case 'linkPayAffirmBtn':
            // toast({ color: 'warning', content: '功能待开发' });
            // 联查前准备工作
            let affirmpks = [];
            if (selectedData && selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000012') });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            // 控制只有支付失败和支付成功的才可以查询支付确认单
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                // 结算失败的才可进行结算红冲操作
                // 结算状态为支付失败的单据才可以进行红冲操作
                let settlestatus = val.data.values.settlestatus.value;
                // 0为未结算
                // if (settlestatus == '0') {
                //     error.push(val.data.values.billcode.value);
                // } else {
                //     let pk = val.data.values.pk_settlement.value;
                // 主键数组
                //     affirmpks.push(pk);
                // }
                // 2018-10-29 问题号：87565 支付确认单不加判断，后台控制；
                let pk = val.data.values.pk_settlement.value;
                // 主键数组
                affirmpks.push(pk);
            });
            if (affirmpks.length == 0) {
                let content = '';
                if (error.length != 0) {
                    content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                        + error.join(', ')
                        + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000076'))/* 国际化处理：没有进行过网上支付，不能查询支付确认单！*/
                }
                toast({ color: 'warning', content: content });
                return;
            }
            ajax({
                url: Templatedata.linkpayaffirm,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        // console.log(data);
                        // toast({ color: 'success', content: '联查支付确认单查询出的数据成功' });
                        if (data.yurrefs) {
                            let opentoUrl = '/obm/ebankconfirmpay/confirmpay/main/index.html#/list';
                            // if (data.yurrefs.length > 1) {
                            //     opentoUrl = '/obm/ebankconfirmpay/confirmpay/main/index.html#/list';
                            // }
                            props.openTo(opentoUrl,
                                {
                                    appcode: '36100CONFM',
                                    pagecode: '36100CONFM_L01',
                                    yurrefs: data.yurrefs,
                                    id: data.yurrefs,
                                    type: 'link',
                                    status: 'browse',
                                });

                        } else {
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000076') });/* 国际化处理： 没有支付确认单*/
                        }
                    }
                }
            });
            break;

        //联查影像查看
        case 'imageReview':
            if(CMPEableSscivm.call(this)){
                 return ;
             };
            let imageMap = {};
            imageMap['pk_billid'] = selectedData[0].data.values.pk_busibill.value;//业务单据主键
            imageMap['pk_billtype'] = selectedData[0].data.values.pk_billtypeid.value;//单据类型
            imageMap['pk_tradetype'] = selectedData[0].data.values.pk_tradetype.value;//交易类型
            imageMap['pk_org'] = selectedData[0].data.values.pk_org.value;//组织
            //查询数据
            imageView(imageMap, 'iweb');
            break;

        //联查审批意见
        case 'linkApproveBtn':
            linkApproveBtn.call(this);
            break;
        //联查业务单据审批意见
        case 'linkBusibillApproveBtn':
            linkApproveBtn.call(this, true);
            break;
        //打印
        case 'printBtn':
            let printdata = selectedData;
            if (printdata && printdata.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000047') });/* 国际化处理： 请至少选择一条数据！*/
                return;
            }
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                Templatedata.settleprint,  // 后台url
                {
                    //billtype:'D5',      //单据类型
                    // funcode:'360704SML',   //功能节点编码，即模板编码
                    appcode: Templatedata.bill_funcode,
                    nodekey: 'NCC360704SM',     //模板节点标识
                    // printTemplateID:'0001A810000000049OXO',  //模板id
                    oids: pks
                }
            );
            break;
        case 'outputBtn':
            let outputdata = {
                // funcode:'20521030',      //小应用编码
                appcode: Templatedata.bill_funcode,
                nodekey: 'NCC360704SM',     //模板节点标识
                oids: pks,    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                outputType: 'output'
            }
            this.setState({
                'outputdata': outputdata
            }, () => {
                this.refs.printOutput.open()
            })
            break;
        //附件
        case 'additionBtn':
            //toast({ color: 'warning', content: '功能待开发' });
            if (selectedData.length > 1) {
                toast({ color: 'info', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000048') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
            }
            let additionbillno = selectedData[0].data.values.billcode.value;
            let additionbillid = selectedData[0].data.values.pk_settlement.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null,
                billId: additionbillid,
                billno: additionbillno
            })
            break;
        //制单，
        case 'makebillBtn':
            //制单
            makebillBtn.call(this);
            break;

        case 'refreshBtn':
            self.refreshPks();
            break;
        //更多按钮组里的
        case 'moreBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000049') });/* 国际化处理： 功能待开发*/
            break;

    }
}

/**网上转账 */
const netPay = function ({ selectedData, data, error, self }) {
    // 网上支付不需要控制只能选择一条数据
    // 对数据状态进行校验，非签字态不可进行网上转账
    selectedData.forEach((val) => {
        // 结算状态
        let settlestatus = val.data.values.settlestatus.value;
        // 签字人
        let pk_signer = val.data.values.pk_signer.value;
        if (pk_signer && (settlestatus == '0' || settlestatus == '2' || settlestatus == '6')) {
            // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付
            // 支付失败的单据也可以进行网上支付
        } else {
            let billcode = val.data.values.billcode.value;
            error.push(billcode);
        }
    })
    if (error && error.length > 0) {
        let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
            + error.join(', ')
            + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000068'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
        toast({ color: 'warning', content: content });
        return;
    } else {
        // 此处需要先校验是否可以网银支付，然后再弹框
        ajax({
            url: Templatedata.netpayValidate,
            data: data,
            success: (res) => {
                let { success } = res;
                if (success) {
                    // 成功即代表校验通过，否则就会抛出异常数据
                    self.paydata = data;
                    // props.modal.show('netPayModal');//弹框样式舍弃
                    promptBox({
                        color: "warning",
                        title: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000066'),/* 国际化处理： 网上支付*/
                        content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000067'),/* 国际化处理： 确定进行网上支付?*/
                        beSureBtnClick: this.netPayProcess.bind(this), //使用call直接執行了
                    });
                }
            }
        });
    }
}

/**合并支付 */
const commbinePay = function ({ data }) {
    this.setState({
        modelType: PAYMODEL_COMBINEPAY,
        modalValue: PAYMODEL_COMBINEPAY
    }, () => {
        this.loadBuLuInfo(data);
    });
}

/**结算 */
const settlement = function ({ selectedData, indexs, error, self, data, pks, tss, pktsmap }) {
    //结算,需要校验是否是已审批状态的
    pks = [];
    tss = [];
    pktsmap = {};
    selectedData.forEach((val) => {
        // 结算状态
        let settlestatus = val.data.values.settlestatus.value;
        // 签字人
        let pk_signer = val.data.values.pk_signer.value;
        if (settlestatus == '0' && pk_signer) {
            // 结算状态为未结算'0'为未结算，且签字人不为空，可以进行结算操作
            let pk = val.data.values.pk_settlement.value;
            let ts = val.data.values.ts.value;
            pks.push(pk);//主键数组
            tss.push(ts);
            pktsmap[pk] = ts;
            indexs.push(val.index);
        } else {
            let billcode = val.data.values.billcode.value;
            error.push(billcode);
        }
    })
    if (pks && pks.length == 0) {
        if (error.length > 0) {
            let before = this.getLangCode('000029');/* 国际化处理： 单据编号 */
            let after = this.getLangCode('000036');/* 国际化处理：  不可结算！*/
            let errmessages = [];

            for (let index = 0; index < error.length; index++) {
                const val = error[index];
                let errmessage = before + val + after;
                errmessages.push(errmessage);
            }
            self.settlementBatchToast(commondata.UNSETTLE, 0, error.length, errmessages);

        } else {
            toast({ color: 'warning', content: this.getLangCode('000037') });/* 国际化处理： 您选择的数据不可取消结算*/
        }
        return;
    }
    data = {
        pks: pks,
        tss: tss,
        pktsmap: pktsmap
    };

    ajax({
        url: Templatedata.settlesettle,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    // 后台有返回错误信息
                    let errmsg = data.message.errmsg;
                    let errlength = errmsg.length + error.length;
                    let succlength = pks.length - errmsg.length;

                    self.settlementBatchToast(commondata.SETTLE, succlength, errlength, errmsg);
                    //toast({ color: 'warning', content: data.message.errmsg });
                } else {
                    // 传到后台的全部成功了,需要构造错误信息数组[]
                    let errlength = error.length;
                    let succlength = pks.length;
                    self.settlementBatchToast(commondata.SETTLE, succlength, errlength, []);
                    // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
                }
                // if (error.length > 0) {
                //     let content = 
                //     (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))/* 国际化处理： 单据编号 */
                //     + error.join(', ')
                //     + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000036'));
                //     if(data && data.message && data.message.errmsg){
                //         content = content + data.message.errmsg
                //     }
                //     toast({
                //         color: 'warning', content:content
                //     });/* 国际化处理：  不可结算！*/
                // } else if (data && data.message && data.message.errmsg) {
                //     toast({ color: 'warning', content: data.message.errmsg });
                // } else {
                //     toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000002') });//'结算成功'
                // }
                // 刷新当前页
                // self.refreshPks();
                self.refreshByData(indexs, data);
            }
        }
    });
}

/**批量签字 */
const batchSignAction = function (props, { data, pks, indexs, error, callback }) {
    const self = this;
    ajax({
        url: Templatedata.settlesign,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //begin tm tangleic 20200104 签字增加回调逻辑以支持预算的异常交互
                let hasTbbInfo = false;
                if (callback && typeof callback == 'function') {
                    //是否有预算提示信息，没有才提示操作成功
                    hasTbbInfo = callback(res);
                }
                //end tangleic 
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    // 后台有返回错误信息
                    let errmsg = data.message.errmsg;
                    let errlength = errmsg.length + error.length;
                    let succlength = pks.length - errmsg.length;
                    self.settlementBatchToast(commondata.SIGN, succlength, errlength, errmsg);
                }
                //begin tm tangleic 20200108 没有预算提示信息时才算操作成功
                // else {
                else if (!hasTbbInfo) {
                    //end tangleic 20200108

                    // 传到后台的全部成功了,需要构造错误信息数组[]
                    let errlength = error.length;
                    let succlength = pks.length;
                    if(errlength + succlength == 1){
                        let succMsg = api.loadMultiLang(this.props, '36070-000036')/**签字 */ + api.loadMultiLang(this.props, '36070-000016') /**成功 */;
                        toast({ color: 'success', content: succMsg });
                    }else{
                    self.settlementBatchToast(commondata.SIGN, succlength, errlength, []);
                    // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
                  }
                }
                self.refreshByData(indexs, data);
            }
        }
    });
}

/**批量取消签字 */
const batchUnSingAction = function (props, { data, pks, indexs, error, callback }) {
    const self = this;
    ajax({
        url: Templatedata.settleantisign,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //begin tm tangleic 20200104 签字增加回调逻辑以支持预算的异常交互
                let hasTbbInfo = false;
                if (callback && typeof callback == 'function') {
                    //是否有预算提示信息，没有才提示操作成功
                    hasTbbInfo = callback(res);
                }
                //end tangleic 

                // if(data && data.message && data.message.errmsg && data.message.errmsg.length == 1){
                //       toast({ color: 'warning', content: data.message.errmsg[0] });
                // }
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    // 后台有返回错误信息
                    let errmsg = data.message.errmsg;
                    let errlength = errmsg.length + error.length;
                    let succlength = pks.length - errmsg.length;
                    //begin tm lidyu 如果是一条数据 不走批量的提示 20200330
                    let total = succlength + errlength  
                    if(total == 1){
                        toast({ color: 'danger', content: data.message.errmsg[0] });
                    //end lidyu 20200330
                    }else{
                        self.settlementBatchToast(commondata.UNSIGN, succlength, errlength, errmsg);
                    }
                  
                }
                //begin tm tangleic 20200108 没有预算提示信息时才算操作成功
                //  else {
                else if (!hasTbbInfo) {
                    //end tangleic

                    // 传到后台的全部成功了,需要构造错误信息数组[]
                    let errlength = error.length;
                    let succlength = pks.length;
                    //begin tm lidyu 如果是一条数据 不走批量的提示 20200401
                    let total = succlength + errlength  
                    if(total==1){
                        // toast({ color: 'warning', content: data.message.errmsg[0] });
                        let succMsg = api.loadMultiLang(this.props, '36070-000037')/**取消签字 */ + api.loadMultiLang(this.props, '36070-000016') /**成功 */;
                        toast({ color: 'success', content: succMsg });
                    //end lidyu 20200401
                    }else{
                    self.settlementBatchToast(commondata.UNSIGN, succlength, errlength, []);
                    // toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000003') });//取消结算成功
                 }
                }
                self.refreshByData(indexs, data);
            }
        }
    });
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/