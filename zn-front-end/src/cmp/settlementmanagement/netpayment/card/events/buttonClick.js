/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, toast, print, promptBox } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import appBase from '../../../base'
// import deepClone from "../../../../public/utils/deepClone.js";
import {
    sourceModel_CMP, SHOWMODEL_BULU,
    SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU,
    commondata, getappurl, PAYMODEL_COMBINEPAY
} from "../../../../public/utils/constant.js";
import { linkVoucherApp } from "../../../../../tmpub/pub/util/LinkUtil.js";

export default function (props, id) {
    let self = this;
    let pk = props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
    let alldata = props.form.getAllFormValue(this.formId);      //有值有对象
    let alldata3 = props.form.getAllFormValue(this.tableId);     //有对象，无值
    //特殊处理，用于工资清单支付前弹出ca框使用
    let trade_code = null;
    if (props.form.getFormItemsValue(this.formId, 'tradertypecode') && props.form.getFormItemsValue(this.formId, 'tradertypecode').value) {
        trade_code = props.form.getFormItemsValue(this.formId, 'tradertypecode').value;
        this.setState({
            tradecode: trade_code,
        });
    }
    //子表选择的数据
    let checked = props.cardTable.getCheckedRows(this.tableId);
    let selectedData = alldata.rows;

    let pks = [];
    let tss = [];
    let error = [];
    //处理选择数据
    let pktsmap = {};
    selectedData.forEach((val) => {
        //此处可校验，挑选满足条件的进行操作
        let innerpk = val.values.pk_settlement.value;
        let ts = val.values.ts.value;
        pks.push(innerpk);//主键数组
        tss.push(ts);
        pktsmap[innerpk] = ts;
    });
    let data = {
        'pks': pks,
        'tss': tss,
        pktsmap,
        pageid:Templatedata.card_pageid
    };
    switch (id) {
        /*******支付组 */
        //网上转账
        case 'netpayBtn':
            appBase.api.cardDuplicatePayCheck(this.props,
                {
                    bodyCode: this.tableId,
                    confirm: netPay.bind(this, { data, selectedData, self })
                });
            break;
        //合并支付
        case 'combinpayBtn':
            appBase.api.cardDuplicatePayCheck(this.props,
                {
                    bodyCode: this.tableId,
                    confirm: combinePay.bind(this, { data })
                });
            break;
        //补录网银信息,不需要选择子表，支持批量
        case 'preparenetBtn':
            //toast({ color: 'info', content: '功能验证' });
            //数据校验
            //   if (checked && checked.length != 1) {
            //       toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000000') });/* 国际化处理： 请选择1条子表数据*/
            //       return;
            //   }
            this.setState({
                modelType: SHOWMODEL_BULU,
                paydata: data
            }, () => {
                this.loadBuLuInfo(data);
            });
            break;
        //结算红冲
        case 'redHandleBtn':

            promptBox({
                color: "warning",
                title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000016'),/* 国际化处理： 结算红冲*/
                content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000017'),/* 国际化处理： 结算红冲操作不可逆,确定是否继续?*/
                beSureBtnClick: this.redHandleProcess.bind(this), //使用call直接執行了
            });

            break;
        // 支付变更
        case 'settlePayChangeBtn':
            // 支付变更
            if (!checked || checked.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000001') });/* 国际化处理： 请选择需要支付变更的子表数据!*/
                return;
            }
            //新增-->支付变更只能表体单条进行操作
            if (!checked || checked.length > 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000069') });/* 国际化处理： 只能选择一条记录进行支付变更！*/
                return;
            }
            let paychengevo = checked[0];
            // 子表的支付状态，2为支付失败
            let settlevalue = paychengevo.data.values.settlestatus.value;
            if (!settlevalue || settlevalue != '2') {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000002') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
                return;
            }
            let pk_org = paychengevo.data.values.pk_org.value;
            if (!pk_org) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000002') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
                return;
            }

            // 主表主键
            let changepk_settlement = paychengevo.data.values.pk_settlement.value;
            // 子表主键
            let changepk_detail = paychengevo.data.values.pk_detail.value;
            let changeddata = {
                pk_org: pk_org,
                pk: changepk_settlement,
                ts: paychengevo.data.values.ts.value
            };
            ajax({
                url: Templatedata.settlePayChangeValidate,
                data: changeddata,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        debugger
                        // 表示校验成功，可以进行支付变更。需要跳转去支付变更新增页
                        props.openTo(Templatedata.settlechangeurl,
                            {
                                status: 'add',   // 页面状态
                                srcid: changepk_settlement,
                                src: 'settlement',
                                pk_detail: changepk_detail,
                                appcode: Templatedata.settlechangeappcode,
                                pagecode: Templatedata.settlechangepagecode
                            });
                    }
                }
            });
            break;

        /**联查组 */
        //联查单据，
        case 'linkQueryBillBtn':
            // toast({ color: 'warning', content: '功能待开发' });
            let linkquerybillData = selectedData;
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
                 let pk_busibill = val.values.pk_busibill && val.values.pk_busibill.value;
                 let pk_billtype = val.values.pk_billtype && val.values.pk_billtype.value;
                 if(pk_busibill){
                     showbilltrackpk = pk_busibill;
                 }else{
                     showbilltrackpk = val.values.pk_settlement && val.values.pk_settlement.value;
                 }
                 if(pk_billtype){
                     billtrack_billtype = pk_billtype;
                 }else{
                     billtrack_billtype = val.values.settlebilltype && val.values.settlebilltype.value;
                 }
            });
            if (showbilltrackpk) {
                this.setState({
                    showbilltrack: true,                    //显示联查单据
                    showbilltracktype: billtrack_billtype,  //单据类型
                    showbilltrackpk: showbilltrackpk        //单据pk
                });
            }
            break;
        //联查凭证,验证已跳转，联查的是业务单据的凭证，结算单本身不产生凭证
        case 'linkVoucherBtn':
            // toast({ color: 'info', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000004') });/* 国际化处理： 联查凭证*/
            let val = selectedData[0];
            let pk_group, pkorg, pk_busibill, pk_billtype, billcode;
            if (val.values.pk_group && val.values.pk_group.value != null) {
                pk_group = val.values.pk_group.value;
            }
            if (val.values.pk_org && val.values.pk_org.value != null) {
                pkorg = val.values.pk_org.value;
            }
            // 业务单据id
            if (val.values.pk_busibill && val.values.pk_busibill.value != null) {
                pk_busibill = val.values.pk_busibill.value;
            }
            // 业务单据类型<有交易类型优先传递>
            if (val.values.pk_tradetype && val.values.pk_tradetype.value != null) {
                pk_billtype = val.values.pk_tradetype.value;
            } else if (val.values.pk_billtype && val.values.pk_billtype.value != null) {
                pk_billtype = val.values.pk_billtype.value;
            }
            // 业务单据编号
            if (val.values.billcode && val.values.billcode.value != null) {
                billcode = val.values.billcode.value;
            }
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
                billcode
            )
            break;
        //联查余额
        case 'linkRestMoneyBtn':
            let checkeddata = checked;
            //数据校验
            if (checkeddata && checkeddata.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000000') });/* 国际化处理： 请选择1条子表数据*/
                return;
            }
            let restmoneyarr = [];
            //处理选择数据
            checkeddata.forEach((val) => {

                let restpk_org, restpk_account, restpk_cashaccount;
                if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
                    restpk_org = val.data.values.pk_org.value;
                }
                if (val.data.values.pk_account && val.data.values.pk_account.value != null) {
                    restpk_account = val.data.values.pk_account.value;
                }
                if (val.data.values.pk_cashaccount && val.data.values.pk_cashaccount.value != null) {
                    restpk_cashaccount = val.data.values.pk_cashaccount.value;
                }
                let data = {
                    // 财务组织id
                    pk_org: restpk_org,
                    // 银行账户id，没有可不写，和现金账户二选一        
                    pk_account: restpk_account,
                    // 现金账户id，没有可不写  
                    pk_cashaccount: restpk_cashaccount
                }
                restmoneyarr.push(data);
            });
            this.setState({
                showOriginalData: restmoneyarr,
                showOriginal: true,
            });
            break;
        //联查网银信息
        case 'linkNetBankBtn':
            // 联查网银信息就是浏览网银补录信息
            this.setState({
                modelType: SHOWMODEL_LIULAN,
                modalValue: SHOWMODEL_LIULAN,
            }, () => {
                this.loadBuLuInfo(data);
            });
            break;
        //联查支付确认单
        case 'linkPayAffirmBtn':
            // 联查前准备工作
            let affirmpks = [];
            let affirmerror = [];
            // 控制只有支付失败和支付成功的才可以查询支付确认单
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                let settlestatus = val.values.settlestatus.value;
                // 0为未结算
                if (settlestatus == '0') {
                    affirmerror.push(val.values.billcode.value);
                } else {
                    let pk = val.values.pk_settlement.value;
                    // 主键数组
                    affirmpks.push(pk);
                }
            });
            if (affirmpks.length == 0) {
                let content = '';
                if (affirmerror.length != 0) {
                    content = (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))
                        + affirmerror.join(', ')
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
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000005') });/* 国际化处理： 没有支付确认单*/
                        }
                    }
                }
            });
            break;

        //打印
        case 'printBtn':
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
        // 刷新按钮
        case 'refreshBtn':
            this.refreshCard(pk, null, true);
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
                let settlestatus = val.values.settlestatus.value;
                if (settlestatus && settlestatus == '1') {
                    // 1为支付中单据
                    let pk = val.values.pk_settlement.value;
                    let ts = val.values.ts.value;
                    pks.push(pk);//主键数组
                    tss.push(ts);
                    pktsmap[pk] = ts;
                }
            });
            if (pks && pks.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000006') });/* 国际化处理： 单据不是支付中状态，不可更新支付状态！*/
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
                        if (data.voscard) {
                            this.setFormAndTableData(data.voscard);
                        } else {
                            this.refreshCard(pk, null, true);
                        }
                    }
                }
            });
            break;
        default:
            break
    }
}

/**网上转账 */
const netPay = function ({ selectedData, data, self }) {
    // 对数据状态进行校验，非签字态不可进行网上转账
    let net_error = [];
    selectedData.forEach((val) => {
        // 结算状态
        let settlestatus = val.values.settlestatus.value;
        // 签字人
        let pk_signer = val.values.pk_signer.value;
        if (pk_signer && (settlestatus == '0' || settlestatus == '2' || settlestatus == '6')) {
            // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付

        } else {
            let billcode = val.values.billcode.value;
            net_error.push(billcode);
        }
    })
    if (net_error && net_error.length > 0) {
        let content = (this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023'))
            + net_error.join(', ')
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
    this.setState({
        modelType: PAYMODEL_COMBINEPAY,
        modalValue: SHOWMODEL_ZHIFU, // 补录框类型是支付的
        paydata: data
    }, () => {
        this.loadBuLuInfo(data);
    });
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/