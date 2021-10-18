/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import appBase from '../../../base'
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { commondata } from '../../../../public/utils/constant';
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单制证
import { checkEditRight } from "../../util/checkEditRight.js";
import api from '../../../base/api';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
/**
 * [结算]-列表操作列
 */
export default function tableButtonClick(props, key, text, record, index) {
    let _this = this;
    //begin tm tangleic 20200108 结算签字支持预算异常交互
    let reqData = buildReqData({ record });
    //end tangleic
    switch (key) {
        // 修改
        case 'innerEdit':
            //修改权限校验
            checkEditRight.call(this, record.pk_settlement.value).then((res) => {
                //tm begin lidyu 并发交互跳转卡片检查 20200311
                let ts = record.ts.value;
                go2CardCheck({
                    props,
                    url: Templatedata.gotocardcheck,
                    pk: record.pk_settlement.value,
                    ts: ts,
                    checkTS: ts ? true : false,
                    fieldPK: Templatedata.pkname,
                    actionCode : null ,
                    permissionCode: null ,
                    go2CardFunc: () => {
                        this.props.pushTo('/card', {
                            status: 'edit',
                            id: record.pk_settlement.value
                        });
                    }
                })
                //tm end lidyu 并发交互跳转卡片检查 20200311  
            });
            break;
        // 签字
        case 'innerSign':

            //begin tm tangleic 20200106 签字支持预算异常交互
            // let signpk = [];
            // let signts = [];
            // signpk.push(record.pk_settlement.value);
            // signts.push(record.ts.value);
            // let signdata = {
            //     'pks': signpk,
            //     'tss': signts
            // };

            // ajax({
            //     url: Templatedata.settlesign,
            //     data: signdata,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {
            //             toast({ color: 'success', content: _this.getLangCode('000000') });/* 国际化处理： 签字成功*/
            //             _this.refreshPks();
            //             //props.table.deleteTableRowsByIndex(table_id, index);
            //         }
            //     }
            // });
            signAction.call(this, this.props, {
                data: reqData,
                callback: (res) => {
                    return api.tbbAlarmConfim.call(this, { props: this.props, data: reqData, res, confirm: signAction.bind(this, this.props, { data: reqData }) });
                }
            })
            //end tangleic

            break;
        //取消签字
        case 'innerAntiSign':

            //begin tm tangleic 20200108
            // let antisignpk = [];
            // let antisignts = [];
            // let pktsmaps = {};
            // antisignpk.push(record.pk_settlement.value);
            // antisignts.push(record.ts.value);
            // pktsmaps[record.pk_settlement.value] = record.ts.value;
            // let AntiSigndata = {
            //     'pks': antisignpk,
            //     'tss': antisignts,
            //     'pktsmap': pktsmaps
            // };
            // ajax({
            //     url: Templatedata.settleantisign,
            //     data: AntiSigndata,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {
            //             toast({ color: 'success', content: _this.getLangCode('000001') });/* 国际化处理： 取消签字成功*/
            //             _this.refreshPks();
            //             //props.table.deleteTableRowsByIndex(table_id, index);
            //         }
            //     }
            // });
            unSignAction.call(this, this.props, {
                data: reqData,
                callback: (res) => {
                    return api.tbbAlarmConfim.call(this, { props: this.props, data: reqData, res, confirm: unSignAction.bind(this, this.props, { data: reqData }) })
                }
            })
            //end tangleic
            break;
        //结算
        case 'innerSettle':
            appBase.api.listSingleDuplicatePayCheck(this.props,
                {
                    record,
                    confirm: innerSettlement.bind(this, { record, index })
                });
            break;
        //取消结算
        case 'innerAntiSettle':

            //begin tm lidyu 取消結算去掉校驗  防止多表体有结算成功的单据却无法取消结算 20200402
            //新增取消结算校验：
            // let er_mesg = [];
            // // 结算状态
            // let settles_tatus = record.settlestatus && record.settlestatus.value;
            // // 签字人
            // let signer_pk = record.pk_signer && record.pk_signer.value;
            // if (signer_pk) {  // settlestatus!='0'
            //     // 结算状态为未结算'0'为未结算，不是未结算状态且签字人不为空，可以进行取消结算操作
            //     // 取消结算有可能数据是多子表部分成功，部分不成功的，
            //     // 此时主表还是未结算，去除这种校验，在后台进行校验
            // } else {
            //     let bill_code = record.billcode.value;
            //     er_mesg.push(bill_code);
            // }
            // if (er_mesg.length > 0) {
            //     let before = _this.getLangCode('000029')/* 国际化处理： 单据编号 */
            //     let after = _this.getLangCode('000040');/* 国际化处理：  不可取消结算！*/
            //     let errmessages = [];
            //     for (let index = 0; index < er_mesg.length; index++) {
            //         const val = er_mesg[index];
            //         let errmessage = before + val + after;
            //         errmessages.push(errmessage);
            //     }
            //     _this.settlementBatchToast(commondata.UNSETTLE, 0, er_mesg.length, errmessages);
            //     return;
            // }
            // //end tm lidyu 取消結算去掉校驗  防止多表体有结算成功的单据却无法取消结算 20200402

            let antisettlepk = [];
            let antisettlets = [];
            antisettlepk.push(record.pk_settlement.value);
            antisettlets.push(record.ts.value);
            let antiSettledata = {
                'pks': antisettlepk,
                'tss': antisettlets
            };
            ajax({
                url: Templatedata.settleantisettle,
                data: antiSettledata,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                            // 取消结算失败
                            let errmsg = data.message.errmsg;
                            _this.settlementBatchToast(commondata.UNSETTLE, 0, 1, errmsg);
                        } else {
                            // 取消结算成功
                            _this.settlementBatchToast(commondata.UNSETTLE, 1, 0, []);
                        }
                        // _this.refreshPks();
                        _this.refreshByData([index], data);
                        //props.table.deleteTableRowsByIndex(table_id, index);
                    }
                }
            });
            break;
        //制单
        case 'makebillBtn':
            //处理选择数据,结算成功的才可以制单
            let pk_busibill, pk_tradetype;
            let settlestatus = record.settlestatus.value;
            if (settlestatus != 5) {
                toast({
                    color: 'info',
                    content:
                        this.props.MutiInit.getIntl('360704SM') &&
                        this.props.MutiInit.getIntl('360704SM').get('360704SM-000013')
                }); /* 国际化处理： 结算成功才可以制单！*/
                return;
            }
            // 业务单据id
            if (record.pk_busibill && record.pk_busibill.value != null) {
                pk_busibill = record.pk_busibill.value;
            }
            // 业务单据类型
            if (record.pk_tradetype && record.pk_tradetype.value != null) {
                pk_tradetype = record.pk_tradetype.value;
            }
            MakeBillApp(this.props, Templatedata.bill_funcode, pk_busibill, pk_tradetype);
            break;
        // 支付变更
        case 'settlePayChangeBtn':
            // 支付变更，需要变更的是子表数据，我不知道是哪个子表
            // this.props.modal.show('redHandleModal');
            // if (!checked || checked.length==0) {
            //     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000001') });/* 国际化处理： 请选择需要支付变更的子表数据!*/
            //     return;
            // }
            // let paychengevo = checked[0];
            // // 子表的支付状态，2为支付失败
            // let settlevalue = record.settlestatus.value;
            // if (!settlevalue || settlevalue!='2') {
            //     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000002') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
            //     return;
            // }
            //     let pk_org = record.pk_org.value;
            //     if (!pk_org) {
            //         toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000002') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
            //         return;
            //     }
            //     let changeddata = {
            //         pk_org:pk_org
            //     };
            //     ajax({
            //         url: Templatedata.settlePayChangeBtn,
            //         data: data,
            //         success: (res) => {
            //             let {success,data} = res;
            //             if (success) {
            //                 // 表示校验成功，可以进行支付变更。需要跳转去支付变更新增页

            //             }
            //         }
            //     });
            break;
        // 结算红冲
        case 'redHandleBtn':

            let pks = [];
            let tss = [];
            //处理选择数据
            let pktsmap = {};
            //此处可校验，挑选满足条件的进行操作
            let pk = record.pk_settlement.value;
            let ts = record.ts.value;
            pks.push(pk);//主键数组
            tss.push(ts);
            pktsmap[pk] = ts;
            let data = {
                pks: pks,
                tss: tss,
                pktsmap: pktsmap
            };
            ajax({
                url: Templatedata.settleredhandle,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000021') });/* 国际化处理： 红冲成功*/
                        _this.refreshPks();
                    }
                }
            });
            break;
        //网上转账
        case 'innerNetpayBtn':
            appBase.api.listSingleDuplicatePayCheck(this.props,
                {
                    record,
                    confirm: innerNetPay.bind(this, { record, index })
                });
            break;
    }
}

/**网上转账 */
const innerNetPay = function ({ record, index }) {
    //设置ca弹框--使用工资清单单据结算支付使用
    let trade_code = record.tradertypecode.value;
    this.setState({
        tradecode: trade_code,
    });
    //设置表格的选中状态:防止在补录保存的时候校验失败
    this.props.table.selectAllRows(this.tableId, false);
    this.props.table.selectTableRows(this.tableId, [index], true);
    // 网上转账
    // 对数据状态进行校验，非签字态不可进行网上转账
    // 结算状态
    let netsettlestatus = record.settlestatus.value;
    // 签字人
    let netpk_signer = record.pk_signer.value;
    let error = [];
    if (netpk_signer && (netsettlestatus == '0' || netsettlestatus == '2')) {
        // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付

    } else {
        let billcode = record.billcode.value;
        error.push(billcode);
    }
    if (error && error.length > 0) {
        let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
            + error.join(', ')
            + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000068'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
        toast({ color: 'warning', content: content });
        return;
    } else {
        let pk = record.pk_settlement.value;
        let ts = record.ts.value;
        let pks = [];
        let tss = [];
        let pktsmap = {};
        let indexs = [];
        pks.push(pk);
        tss.push(ts);
        pktsmap[pk] = ts;
        indexs.push(index);
        let data = {
            pks: pks,
            tss: tss,
            pktsmap: pktsmap,
        };
        // 此处需要先校验是否可以网银支付，然后再弹框
        ajax({
            url: Templatedata.netpayValidate,
            data: data,
            success: (res) => {
                let { success } = res;
                if (success) {
                    // 成功即代表校验通过，否则就会抛出异常数据、
                    // 成功即代表校验通过，否则就会抛出异常数据
                    this.paydata = data;
                    // _this.isinnerpay = true;//表示操作列中进行的网上转账
                    // props.modal.show('netPayModal');
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

/**结算 */
const innerSettlement = function ({ record, index }) {
    let settlepks = [];
    let settlets = [];
    settlepks.push(record.pk_settlement.value);
    settlets.push(record.ts.value);
    let settledata = {
        'pks': settlepks,
        'tss': settlets
    };
    ajax({
        url: Templatedata.settlesettle,
        data: settledata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    let errmsg = data.message.errmsg;
                    //结算失败
                    this.settlementBatchToast(commondata.SETTLE, 0, 1, errmsg);
                } else {
                    //结算成功
                    this.settlementBatchToast(commondata.SETTLE, 1, 0, []);
                }
                // console.log(data);
                // toast({ color: 'success', content: _this.getLangCode('000002') });/* 国际化处理： 结算成功*/
                // _this.refreshPks();
                this.refreshByData([index], data);
                //props.table.deleteTableRowsByIndex(table_id, index);
            }
        }
    });
}

/**构建请求数据 */
const buildReqData = function ({ record }) {
    let signpk = [];
    let signts = [];
    signpk.push(record.pk_settlement.value);
    signts.push(record.ts.value);
    return {
        'pks': signpk,
        'tss': signts
    };
}

/**
 *  签字动作
 */
const signAction = function (props, { data, callback }) {
    const _this = this;
    ajax({
        url: Templatedata.settlesign,
        data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //begin tm lidyu 取消签字失败没有提示
                let haswarninfo = false;
                 if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                     toast({ color: 'warning', content: data.message.errmsg[0] });
                     haswarninfo = true;
                    }
                //end lidyu
                if (data.vos) {
                    let hasTbbInfo = false;
                    if (callback && typeof callback == 'function') {
                       //是否有预算提示信息，没有才提示操作成功
                       hasTbbInfo = callback(res);
                      }
                      if (!hasTbbInfo && !haswarninfo) {
                         let succMsg = api.loadMultiLang(props, '36070-000036')/**签字 */ + api.loadMultiLang(props, '36070-000016') /**成功 */;
                         toast({ color: 'success', content: succMsg });
                   }
                _this.refreshPks();
                //props.table.deleteTableRowsByIndex(table_id, index);
            }
        }
        }
        
    });
}

/**
 * 取消签字
 */
const unSignAction = function (props, { data, callback }) {
    const _this = this;
    ajax({
        url: Templatedata.settleantisign,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //begin tm lidyu 取消签字失败增加提示
                let haswarninfo = false;
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    toast({ color: 'danger', content: data.message.errmsg[0] });
                    haswarninfo = true;
                }
                //end lidyu
                if (data.vos) {
                let hasTbbInfo = false;
                   if (callback && typeof callback == 'function') {
                    //是否有预算提示信息，没有才提示操作成功
                    hasTbbInfo = callback(res);
                  }
                  if (!hasTbbInfo && !haswarninfo) {
                    let succMsg = api.loadMultiLang(this.props, '36070-000037')/**取消签字 */ + api.loadMultiLang(this.props, '36070-000016') /**成功 */;
                    toast({ color: 'success', content: succMsg });
                }
                _this.refreshPks();
                //props.table.deleteTableRowsByIndex(table_id, index);
            }
        }
        }
    });
}
/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/