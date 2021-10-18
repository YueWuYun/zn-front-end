/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, promptBox, toast, cacheTools, print } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import appBase from '../../../base'
import {
    sourceModel_CMP, SHOWMODEL_BULU,
    SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU,
    PAYMODEL_COMBINEPAY,
    commondata, getappurl
} from '../../../../public/utils/constant';
import { linkVoucherApp } from "../../../../../tmpub/pub/util/LinkUtil.js";
export default function buttonClick(props, id) {
    let self = this;
    if ('refreshBtn' == id) {
        self.refreshBtn();
        return;
    }
    let selectedData = props.table.getCheckedRows(this.tableId);
    let pks = [];
    let tss = [];
    if (!selectedData || selectedData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000012') });/* 国际化处理： 请选择数据*/
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
        pageid: Templatedata.list_pageid

    };
    let error = [];
    let indexs = [];
    switch (id) {
        //小应用按钮
        case 'signBtn':
            //签字,需要校验是否是已审批状态的
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
                    toast({
                        color: 'warning', content:
                            (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                            + error.join(', ')
                            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000024'))
                    });/* 国际化处理：  不可签字！*/
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000025') });/* 国际化处理： 您选择的数据不可签字*/
                }
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settlesign,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {

                        if (error.length > 0) {
                            toast({
                                color: 'warning', content:
                                    (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                                    + error.join(', ')
                                    + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000026'))
                            });/* 国际化处理：  签字失败！*/
                        } else {
                            // toast({ color: 'success', content: '签字成功' });
                        }
                        //props.table.deleteTableRowsByIndex(table_id, index);
                        // 更新数据,data需要组装成该方法可以识别的情况
                        self.refreshByData(indexs, data);
                    }
                }
            });
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
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                if (settlestatus == '0' && pk_signer) {
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
                    toast({
                        color: 'warning', content:
                            (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                            + error.join(', ')
                            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000027'))
                    });/* 国际化处理：  不可取消签字！*/
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000028') });/* 国际化处理： 您选择的数据不可取消签字*/
                }
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settleantisign,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {

                        if (error.length > 0) {
                            toast({
                                color: 'warning', content:
                                    (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                                    + error.join(', ')
                                    + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000029'))
                            });/* 国际化处理：  取消签字失败！*/
                        } else {
                            // toast({ color: 'success', content: '取消签字成功' });
                        }
                        //props.table.deleteTableRowsByIndex(table_id, index);
                        // 刷新当前页
                        // self.refreshPks();
                        self.refreshByData(indexs, data);
                    }
                }
            });
            break;

        //结算
        case 'settleBtn':
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
                    toast({
                        color: 'warning', content:
                            (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                            + error.join(', ')
                            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000030'))
                    });/* 国际化处理：  不可结算！*/
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000031') });/* 国际化处理： 您选择的数据不可结算*/
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
                        if (error.length > 0) {
                            toast({
                                color: 'warning', content:
                                    (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                                    + error.join(', ')
                                    + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000030'))
                            });/* 国际化处理：  不可结算！*/
                        } else {
                            // toast({ color: 'success', content: '结算成功' });
                        }
                        // 刷新当前页
                        // self.refreshPks();
                        self.refreshByData(indexs, data);
                    }
                }
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
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000032') });/* 国际化处理： 请选择至少两条可以合并结算的数据*/
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
                                        (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                                        + error.join(', ')
                                        + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000033'))
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
                let settlestatus = val.data.values.settlestatus.value;
                // 签字人
                let pk_signer = val.data.values.pk_signer.value;
                if (settlestatus != '0' && pk_signer) {
                    // 结算状态为未结算'0'为未结算，不是未结算状态且签字人不为空，可以进行取消结算操作
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
                    toast({
                        color: 'warning', content:
                            (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                            + error.join(', ')
                            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000034'))
                    });/* 国际化处理：  不可取消结算！*/
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000035') });/* 国际化处理： 您选择的数据不可取消结算*/
                }
                return;
            }
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
                        // toast({ color: 'success', content: '取消结算成功' });
                        // 刷新当前页
                        // self.refreshPks();
                        self.refreshByData(indexs, data);
                    }
                }
            });
            break;
        //委托办理
        case 'commitToFTSBtn':

            ajax({
                url: Templatedata.settlecommit,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000036') });/* 国际化处理： 委托办理成功*/
                        // 刷新当前页
                        self.refreshPks();
                    }
                }
            });
            break;
        // 取消委托
        case 'cancelCommitToFTSBtn':
            ajax({
                url: Templatedata.settlecancelcommit,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000036') });/* 国际化处理： 委托办理成功*/
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
            //begin tm tangleic 20190627 将原有按钮处理逻辑封装成方法combinePay 合并支付对重复支付的数据进行检查
            appBase.api.multiDataDuplicatePayCheck(this.props,
                {
                    tableCode: this.tableId,
                    confirm: combinePay.bind(this, { data })
                });
            //end tangleic
            break;
        //补录网银信息
        case 'preparenetBtn':
            //toast({ color: 'warning', content: '功能待验证' }); 
            //this.state.modelType = SHOWMODEL_BULU;
            // 控制只能选择一条数据
            if (selectedData && selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000037') });/* 国际化处理： 请选择一条数据！*/
                return;
            }
            this.setState({
                modelType: SHOWMODEL_BULU,
                paydata: data
            }, () => {
                this.loadBuLuInfo(data);
            });
            break;
        //结算红冲
        case 'redHandleBtn':
            // 先校验再提示模态框
            if (!selectedData || selectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000038') });/* 国际化处理： 请选择1条数据*/
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
                let content = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000039');/* 国际化处理： 您选择的数据不可进行红冲操作！*/
                if (error.length != 0) {
                    content = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023') + error.join(', ') + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000040')/* 国际化处理： 单据编号 , 不可进行红冲操作！*/
                }
                toast({ color: 'warning', content: content });
                return;
            }
            promptBox({
                color: "warning",
                title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000016'),/* 国际化处理： 结算红冲*/
                content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000017'),/* 国际化处理： 结算红冲操作不可逆,确定是否继续?*/
                beSureBtnClick: this.redHandleProcess.bind(this), //使用call直接執行了
            });

            break;

        /**联查组 */
        //联查单据
        case 'linkQueryBillBtn':
            let linkquerybillData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (linkquerybillData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000003') });/* 国际化处理： 请选择单条数据，联查单据!*/
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
            break;
        //联查凭证,验证已跳转
        case 'linkVoucherBtn':
            // toast({ color: 'info', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000004') });/* 国际化处理： 联查凭证*/
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
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000041') });/* 国际化处理： 联查余额列表页不支持*/
            return;

            let buybalanceBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (buybalanceBtnData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000038') });/* 国际化处理： 请选择1条数据*/
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
            window.parent.openNew({ code: '360701OBP', name: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000042'), pk_appregister: '0001Z61000000003AULD' }, null, /* 国际化处理： 期初余额联查*/
                'status=browse&src=exchange')
            break;
        //联查网银信息
        case 'linkNetBankBtn':
            //toast({ color: 'warning', content: '功能待开发' });
            // 联查网银信息就是浏览网银补录信息
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
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000038') });/* 国际化处理： 请选择1条数据*/
                return;
            }
            // 控制只有支付失败和支付成功的才可以查询支付确认单
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                // 结算失败的才可进行结算红冲操作
                // 结算状态为支付失败的单据才可以进行红冲操作
                let settlestatus = val.data.values.settlestatus.value;
                // 0为未结算
                if (settlestatus == '0') {
                    error.push(val.data.values.billcode.value);
                } else {
                    let pk = val.data.values.pk_settlement.value;
                    // 主键数组
                    affirmpks.push(pk);
                }
            });
            if (affirmpks.length == 0) {
                let content = '';
                if (error.length != 0) {
                    content = (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))
                        + error.join(', ')
                        + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000066'))/* 国际化处理：没有进行过网上支付，不能查询支付确认单！*/
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
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000066') });/* 国际化处理： 没有支付确认单*/
                        }
                    }
                }
            });
            break;

        //打印
        case 'printBtn':
            let printdata = selectedData;
            if (printdata && printdata.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000043') });/* 国际化处理： 请至少选择一条数据！*/
                return;
            }
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                Templatedata.settleprint,  // 后台url
                {
                    //billtype:'D5',      //单据类型
                    // funcode:'360704SML',   //功能节点编码，即模板编码
                    appcode: Templatedata.bill_funcode,
                    nodekey: 'NCC36070OP',     //模板节点标识
                    // printTemplateID:'0001A810000000049OXO',  //模板id
                    oids: pks
                }
            );
            break;
        case 'outputBtn':
            if (selectedData && selectedData.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000043') });/* 国际化处理： 请至少选择一条数据！*/
                return;
            }
            let outputdata = {
                // funcode:'20521030',      //小应用编码
                nodekey: 'NCC36070OP',     //模板节点标识
                appcode: Templatedata.bill_funcode,
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
                toast({ color: 'info', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000044') });/* 国际化处理： 仅可选择一条数据上传附件，此处默认上传附件至您选择的第一条数据!*/
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
            if (selectedData.length != 1) {
                toast({ color: 'info', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000037') });/* 国际化处理： 请选择一条数据！*/
            }
            let makebill_billtype = '';
            //需要调用各自单据的制单
            let makebillData = selectedData;
            //let pk_billtype='2201';
            //数据校验
            let makebillarr = [];
            //处理选择数据,结算成功的才可以制单
            let flag = false;
            makebillData.forEach((val) => {
                let pk_busibill, pk_billtype
                let settlestatus = val.data.values.settlestatus.value;
                if (settlestatus != 5) {
                    flag = true;
                    return;
                }
                // 业务单据id
                if (val.data.values.pk_busibill && val.data.values.pk_busibill.value != null) {
                    pk_busibill = val.data.values.pk_busibill.value;
                }
                // 业务单据类型
                if (val.data.values.pk_billtype && val.data.values.pk_billtype.value != null) {
                    pk_billtype = val.data.values.pk_billtype.value;
                }

                let makebill = {
                    pk_billtype: pk_billtype,
                    relationID: pk_busibill
                }
                makebillarr.push(makebill);

            });
            if (flag) {
                toast({ color: 'info', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000045') });/* 国际化处理： 结算成功才可以制单！*/
                return;
            }
            // if (props.form.getFormItemsValue(this.formId, 'bill_type').value) {
            //     makebill_billtype = props.form.getFormItemsValue(this.formId, 'bill_type').value;
            // }
            let makebillArr = [];
            let makeArr = [];
            makebillArr.push(makebill_billtype);
            //处理选择数据
            let pk_recbill_id = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
            let makebill_cachekey = Templatedata.list_appid + '_MadeBill';
            makebillArr.push(pk_recbill_id);
            makeArr.push(makebillArr);
            cacheTools.set(makebill_cachekey, makeArr);
            console.log(makeArr, "makebillArr");

            let makebill_appOption = {
                code: makebill_code,
                name: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000046'),/* 国际化处理： 制单*/
                pk_appregister: makebill_appid
            };
            let makebill_type = {
                type: null
            };
            let makebill_query = {
                status: 'browse',
                src: makebill_cachekey,
                callback: ''//回调页面
            }
            window.parent.openNew(makebill_appOption, "", makebill_query);
            break;
        case 'refreshBtn':
            self.refreshPks();
            break;
        // 更新支付状态
        case 'updatePayStatusBtn':
            // 更新支付状态只可一条一条更新
            // 需要对选择的数据进行遍历校验，是否需要进行更新支付状态
            pks = [];
            tss = [];
            pktsmap = {};
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                let settlestatus = val.data.values.settlestatus.value;
                if (settlestatus && settlestatus == '1') {
                    // 1为支付中单据
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
            });
            if (pks && pks.length == 0) {
                if (error.length > 0) {
                    toast({
                        color: 'warning', content:
                            (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))/* 国际化处理： 单据编号 */
                            + error.join(', ')
                            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000047'))
                    });/* 国际化处理：  不是支付中状态，不可更新支付状态！*/
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000048') });/* 国际化处理： 您选择的数据不可更新支付状态*/
                }
                return;
            }
            data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.netpayupdatestatus,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        // 刷新当前页
                        // self.refreshPks();
                        self.refreshByData(indexs, data);
                    }
                }
            });

            break;

    }


}

const netPay = function ({ selectedData, error, data, self }) {
    // 对数据状态进行校验，非签字态不可进行网上转账
    selectedData.forEach((val) => {
        // 结算状态
        let settlestatus = val.data.values.settlestatus.value;
        // 签字人
        let pk_signer = val.data.values.pk_signer.value;
        if (pk_signer && (settlestatus == '0' || settlestatus == '2' || settlestatus == '6')) {
            // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付

        } else {
            let billcode = val.data.values.billcode.value;
            error.push(billcode);
        }
    })
    if (error && error.length > 0) {
        let content = (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))
            + error.join(', ')
            + (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000062'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
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
                    self.setState({
                        paydata: data
                    }, () => {
                        promptBox({
                            color: "warning",
                            title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000020'),/* 国际化处理： 网上支付*/
                            content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000061'),/* 国际化处理： 确定进行网上支付?*/
                            beSureBtnClick: this.netPayProcess.bind(this), //使用call直接執行了
                        });
                    })
                }
            }
        });
    }
}

/**合并支付 */
const combinePay = function ({ data }) {
    //toast({ color: 'warning', content: '功能待开发' });
    //this.state.modelType = PAYMODEL_COMBINEPAY;
    this.setState({
        modelType: PAYMODEL_COMBINEPAY,
        modalValue: SHOWMODEL_ZHIFU,  // 合并支付传给网银的补录框类型需要是支付的类型
        paydata: data
    }, () => {
        this.loadBuLuInfo(data);
    });
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/