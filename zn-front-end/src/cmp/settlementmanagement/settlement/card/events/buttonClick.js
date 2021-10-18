/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, toast, promptBox, print, deepClone, cardCache } from 'nc-lightapp-front';
import appBase from '../../../base'
const { api, cons } = appBase;
import { Templatedata } from "../../config/Templatedata";
let { updateCache } = cardCache;
import {
    sourceModel_CMP, SHOWMODEL_ZHIFU,
    commondata, getappurl,
    SHOWMODEL_LIULAN, SHOWMODEL_BULU,
    PAYMODEL_COMBINEPAY
} from "../../../../public/utils/constant.js";
import Sign from '../../../../../tmpub/pub/util/ca';
import { makebillBtn } from '../buttonClick/makebillBtn.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from "../../../../../tmpub/pub/util/LinkUtil.js";
import { linkApproveBtn } from '../buttonClick/linkApproveBtn.js';
import { checkEditRight } from "../../util/checkEditRight.js";
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';

export default async function (props, id) {
    let saveObj = {};
    saveObj["table_settle_detail"] = 'cardTable';
    let billdata = props.createMasterChildData("360704SM_C01", "table_settle_head", "table_settle_detail");
    let pk = props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
    let saga_frozen = props.form.getFormItemsValue(this.formId, 'saga_frozen').value;
    let saga_status = props.form.getFormItemsValue(this.formId, 'saga_status').value;

    let alldata = props.form.getAllFormValue(this.formId);      //有值有对象
    //let alldata2 = props.form.getAllFormValue(this.searchId);
    //   let alldata3 = props.form.getAllFormValue(this.tableId);     //有对象，无值
    //let alldata4 = props.form.getAllFormValue(this.pageId);
    //子表选择的数据
    let checked = props.cardTable.getCheckedRows(this.tableId);
    let bodys = props.cardTable.getAllRows(this.tableId);
    //   let checked1 = props.table.getCheckedRows(this.formId);
    //   let checked2 = props.table.getCheckedRows(this.pageId);
    //   let checked3 = props.table.getCheckedRows(this.moduleId);
    //特殊处理，用于工资清单支付前弹出ca框使用
    let trade_code = null;
    if (props.form.getFormItemsValue(this.formId, 'tradertypecode') && props.form.getFormItemsValue(this.formId, 'tradertypecode').value) {
        trade_code = props.form.getFormItemsValue(this.formId, 'tradertypecode').value;
        this.setState({
            tradecode: trade_code,
        });
    }
    //结算状态
    let setlle_status = props.form.getFormItemsValue(this.formId, 'settlestatus').value;
    let selectedData = alldata.rows;

    let pks = [];
    let tss = [];
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
        'pageid': Templatedata.card_pageid,
        'iscard': true,//卡片请求标识
        pktsmap: pktsmap
    };
    switch (id) {


         //头部 驳回
         case 'back': 
         let isback = this.props.form.getFormItemsValue(this.formId, 'isback') .value;
             if (isback != true) {
                 let pk_billtype = this.props.form.getFormItemsValue(this.formId, 'pk_billtype') .value;
                 if (pk_billtype=="F5" || pk_billtype =="F3" || pk_billtype =="264X") {
                     let busistatus = this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
                     let aduitstatus = this.props.form.getFormItemsValue(this.formId, 'aduitstatus').value;
                     if (busistatus != 8 && aduitstatus != null && aduitstatus == 0) {
                         //显示驳回弹框
                         this.setState({ showModal: true });
                     } else {
                         toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get("360704SM-000110") });
                     }
 
                 } else {
                     toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get("360704SM-000109") });
                 }
             } else {
                 toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get("360704SM-000108") });
             }
            
          break;

        //保存，留着备用
        case 'saveBtn':
            // let changedata = props.cardTable.getChangedRows(this.tableId);
            // let savedata = props.createMasterChildData(Templatedata.card_pageid, 
            //     Templatedata.card_formid, this.tableId);
            // 验证公式，保存时调用
            // this.props.validateToSave( data , this.saveBill() , null , null )
            this.props.validateToSave(billdata, () => {
                this.saveBill()
            }, saveObj, '');
            break;
        //删除,无
        case 'delete':
            this.props.modal.show('delete');
            break;
        //取消操作
        case 'cancelBtn':
            // alert(this.props.getUrlParam('status'));
            // 取消弹框借用红冲弹框一用
            promptBox({
                color: "warning",
                title: this.getLangCode('000088'),/* 国际化处理： 确认取消*/
                beSureBtnClick: this.onCancel.bind(this)
            });
            break;
        //签字
        case 'signBtn':
            // let signData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
            //签字
            //begin tm tangleic 20200104 签字增加预算异常交互
            // ajax({
            //     url: Templatedata.settlesign,
            //     data: data,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {
            //             if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
            //                 toast({ color: 'warning', content: data.message.errmsg[0] });
            //             } else {
            //                 toast({ color: 'success', content: this.getLangCode('000000') });/* 国际化处理： 结算成功*/
            //             }
            //             if (data.vos) {
            //                 this.props.beforeUpdatePage();//打开开关
            //                 if (data.vos.head) {
            //                     this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
            //                     //页签赋值
            //                     let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
            //                     let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
            //                     this.billno = billno;
            //                     this.billId = billId;// 单据id，用于刷新卡片页，附件上传
            //                     // 更新缓存
            //                     updateCache(
            //                         'pk_settlement',
            //                         billId,
            //                         res.data.vos,
            //                         this.formId,
            //                         this.listDataSource,
            //                         res.data.vos.head[this.formId].rows[0].values
            //                     );
            //                 }
            //                 if (data.vos.body) {
            //                     // this.props.cardTable.setTableData(this.tableId, { rows: [] });
            //                     //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
            //                     api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
            //                     //end tangleic
            //                     this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
            //                 }

            //                 this.props.setUrlParam({
            //                     status: 'browse'
            //                 });
            //                 // this.refreshCard(pk, null, true);
            //                 // 此处均由卡片页本页面设置按钮显隐性
            //                 this.toggleShowBydata(null);
            //                 // 设置编辑性，此处先不做处理，因为会报错
            //                 // this.setEditableByDirection();
            //                 // 此处调用组织多版本展示，结算需要
            //                 this.formMultiVersionProcess();
            //                 this.props.updatePage(this.formId, this.tableId);//关闭开关

            //                 if (data.tbbctrlinfo) {
            //                     api.tbbWarnDialog(props, {
            //                         ntbinfos: data.tbbctrlinfo,
            //                         onConfirm: (pks) => {
            //                         }
            //                     });
            //                 }

            //             } else {
            //                 this.refreshCard(pk, null, true);
            //             }
            //         }
            //     }
            // });
            signAction.call(this, data, (res) => {
                return api.tbbAlarmConfim({ props: this.props, data, res, confirm: signAction.bind(this, data) })
            })
            //end tangleic
            break;
        //取消签字
        case 'antiSignBtn':
            // let antiSignData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

            //begin tm tangleic 20200106 取消签字支持预算异常交互
            // ajax({
            //     url: Templatedata.settleantisign,
            //     data: data,
            //     success: (res) => {
            //         let { success, data } = res;
            //         if (success) {

            //             if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
            //                 toast({ color: 'warning', content: data.message.errmsg[0] });
            //             } else {
            //                 toast({ color: 'success', content: this.getLangCode('000001') });/* 国际化处理： 结算成功*/
            //             }
            //             if (data.vos) {
            //                 this.props.beforeUpdatePage();//打开开关
            //                 if (data.vos.head) {
            //                     this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
            //                     //页签赋值
            //                     let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
            //                     let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
            //                     this.billno = billno;
            //                     this.billId = billId;// 单据id，用于刷新卡片页，附件上传
            //                     // 更新缓存
            //                     updateCache(
            //                         'pk_settlement',
            //                         billId,
            //                         res.data.vos,
            //                         this.formId,
            //                         this.listDataSource,
            //                         res.data.vos.head[this.formId].rows[0].values
            //                     );
            //                 }
            //                 if (data.vos.body) {
            //                     // this.props.cardTable.setTableData(this.tableId, { rows: [] });
            //                     //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
            //                     api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
            //                     //end tangleic
            //                     this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
            //                 }

            //                 this.props.setUrlParam({
            //                     status: 'browse'
            //                 });
            //                 // 此处均由卡片页本页面设置按钮显隐性
            //                 this.toggleShowBydata(null);
            //                 // 设置编辑性，此处先不做处理，因为会报错
            //                 // this.setEditableByDirection();
            //                 // 此处调用组织多版本展示，结算需要
            //                 this.formMultiVersionProcess();
            //                 this.props.updatePage(this.formId, this.tableId);//关闭开关
            //             } else {
            //                 this.refreshCard(pk, null, true);
            //             }
            //         }
            //     }
            // });
            unSignAction.call(this, data, (res) => {
                return api.tbbAlarmConfim({ props: this.props, data, res, confirm: unSignAction.bind(this, data) })
            })
            //end tangleic
            break;

        //结算
        case 'settleBtn':
            // let settleData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
            appBase.api.cardDuplicatePayCheck(this.props,
                {
                    bodyCode: this.tableId,
                    confirm: settlement.bind(this, { data, setlle_status, pk })
                })
            break;
        //取消结算
        case 'antiSettleBtn':
            // let antiSettleData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

            //begin tm lidyu 取消結算去掉校驗  防止多表体有结算成功的单据却无法取消结算 20200402
            //新增取消结算校验：
            let er_mesg = [];
            // 结算状态props.form.getFormItemsValue(this.formId, 'settlestatus').value
            let settles_tatus = props.form.getFormItemsValue(this.formId, 'settlestatus') && props.form.getFormItemsValue(this.formId, 'settlestatus').value;
            // 签字人
            let signer_pk = props.form.getFormItemsValue(this.formId, 'pk_signer') && props.form.getFormItemsValue(this.formId, 'pk_signer').value;
            if (signer_pk) {  // settlestatus!='0'
                // 结算状态为未结算'0'为未结算，不是未结算状态且签字人不为空，可以进行取消结算操作
                // 取消结算有可能数据是多子表部分成功，部分不成功的，
                // 此时主表还是未结算，去除这种校验，在后台进行校验
            } else {
                let bill_code = props.form.getFormItemsValue(this.formId, 'billcode') && props.form.getFormItemsValue(this.formId, 'billcode').value;
                er_mesg.push(bill_code);
            }
            if (er_mesg.length > 0) {
                let before_mesg = this.getLangCode('000029')/* 国际化处理： 单据编号 */
                let after_mesg = this.getLangCode('000040');/* 国际化处理：  不可取消结算！*/
                for (let index = 0; index < er_mesg.length; index++) {
                    let err_message = before_mesg + er_mesg[index] + after_mesg;
                    toast({ color: 'danger', content: err_message });/* 国际化处理： 您选择的数据不可取消结算*/
                }
                return;
            }
            //end tm lidyu 取消結算去掉校驗  防止多表体有结算成功的单据却无法取消结算 20200402

            ajax({
                url: Templatedata.settleantisettle,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                            toast({ color: 'warning', content: data.message.errmsg[0] });
                        } else {
                            toast({ color: 'success', content: this.getLangCode('000003') });/* 国际化处理： 取消结算成功*/
                        }

                        if (data.vos) {
                            this.props.beforeUpdatePage();//打开开关
                            if (data.vos.head) {
                                this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
                                //页签赋值
                                let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
                                let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
                                this.billno = billno;
                                this.billId = billId;// 单据id，用于刷新卡片页，附件上传
                                // 更新缓存
                                updateCache(
                                    'pk_settlement',
                                    billId,
                                    res.data.vos,
                                    this.formId,
                                    this.listDataSource,
                                    res.data.vos.head[this.formId].rows[0].values
                                );
                            }
                            if (data.vos.body) {
                                // this.props.cardTable.setTableData(this.tableId, { rows: [] });
                                //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
                                api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
                                //end tangleic
                                this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
                            }

                            this.props.setUrlParam({
                                status: 'browse'
                            });
                            // 此处均由卡片页本页面设置按钮显隐性
                            this.toggleShowBydata(null);
                            // 设置编辑性，此处先不做处理，因为会报错
                            // this.setEditableByDirection();
                            // 此处调用组织多版本展示，结算需要
                            this.formMultiVersionProcess();
                            this.props.updatePage(this.formId, this.tableId);//关闭开关
                        } else {
                            this.refreshCard(pk, null, true);//刷新页面
                        }
                    }
                }
            });
            break;
        //委托办理，不支持批量操作，需要修改，需要进行强制CA用户校验
        case 'commitToFTSBtn':
            let error = [];
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                let settlestatus = val.values.settlestatus && val.values.settlestatus.value;
                // 业务单据状态 '8'表示签字态
                let busistatus = val.values.busistatus && val.values.busistatus.value;
                // 签字人
                let pk_signer = val.values.pk_signer && val.values.pk_signer.value;
                if (busistatus && busistatus == '8' && settlestatus && settlestatus == '0') {
                    // 签字态未结算的单据可以委托

                } else {
                    // 否则不能进行委托办理
                    let billcode = val.data.values.billcode.value;
                    error.push(billcode);
                }
            });
            if (error && error.length > 0) {
                let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                    + error.join(', ')
                    + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000070'));/* 国际化处理： 单据编号 , 不可进行委托办理操作！*/
                toast({ color: 'warning', content: content });
                return;
            }
            // 委托办理需要强制CA校验
            // 强制弹框输入密码
            //tm lidyu 结算委托办理需要CA验签代码回退 
            let result = await Sign({
                data: null,
                encryptVOClassName: null,
                isSign: false,
                isKey: true,
            })
            //lidyu end
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
                        if (data.vos) {
                            this.renderCardData(data.vos);
                        } else {
                            this.refreshCard(pk, null, true);
                        }
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
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000065') });/* 国际化处理： 委托办理成功*/
                        if (data.vos) {
                            this.renderCardData(data.vos);
                        } else {
                            this.refreshCard(pk, null, true);
                        }
                    }
                }
            });
            break;


        /*******支付组 */
        //网上转账
        case 'netpayBtn':
            // 网上转账校验
            // 对数据状态进行校验，非签字态不可进行网上转账
            appBase.api.cardDuplicatePayCheck(this.props,
                {
                    bodyCode: this.tableId,
                    confirm: netPay.bind(this, { data, selectedData })
                });
            break;
        //合并支付
        case 'combinpayBtn':
            //toast({ color: 'warning', content: '功能待开发' });
            appBase.api.cardDuplicatePayCheck(this.props,
                {
                    bodyCode: this.tableId,
                    confirm: combinePay.bind(this, { data })
                });
            break;
        //补录网银信息,支持批量，不需要选择子表
        case 'preparenetBtn':
            //toast({ color: 'info', content: '功能验证' });
            //数据校验
            //   if (checked && checked.length != 1) {
            //       toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000005') });/* 国际化处理： 请选择1条子表数据*/
            //       return;
            //   }
            // 补录需要补录子表的数据
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
            let errorM = [];
            let pk_tradetype = null;
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                // 结算失败的才可进行结算红冲操作
                // 结算状态为支付失败的单据才可以进行红冲操作
                let settlestatus = val.values.settlestatus.value;
                //交易类型
                pk_tradetype = val.values.pk_tradetype.value;
                // 2为支付失败单据,6为部分成功的单据
                if (settlestatus == '2' || settlestatus == '6') {
                    let pk = val.values.pk_settlement.value;
                    // 主键数组
                    redpks.push(pk);
                } else {
                    errorM.push(val.values.billcode.value);
                }
            });
            //单据类型

            if (pk_tradetype && pk_tradetype == 'DS') {
                // 收款类及工资发放不能 结算红冲
                toast({ color: 'danger', content: (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000100')) });//国际化处理：'工资发放不能进行结算红冲!'
                return;
            }
            if (redpks.length == 0) {
                let content = this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000043');/* 国际化处理： 您选择的数据不可进行红冲操作！*/
                if (errorM.length != 0) {
                    content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                        + errorM.join(', ')
                        + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000044'))/* 国际化处理： 单据编号 , 不可进行红冲操作！*/
                }
                toast({ color: 'warning', content: content });
                return;
            }

            promptBox({
                color: "warning",
                title: this.getLangCode('000022'),// this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000022'),/* 国际化处理： 结算红冲*/
                content: this.getLangCode('000023'),// this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000023'),/* 国际化处理： 结算红冲操作不可逆,确定是否继续?*/
                beSureBtnClick: this.redHandleProcess.bind(this)
            });
            break;

        /**联查组 */
        //联查单据，
        case 'linkQueryBillBtn':
        //begin tm lidyu 添加一个后端校验 到账通知生成的结算单不支持联查单据 20200415
        ajax({
            url: Templatedata.linkvalidate,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let linkquerybillData = selectedData;
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
                        let pk_busibill = val.values.pk_busibill && val.values.pk_busibill.value;
                        let pk_billtype = val.values.pk_billtype && val.values.pk_billtype.value;
                        if (pk_busibill) {
                            showbilltrackpk = pk_busibill;
                        } else {
                            showbilltrackpk = val.values.pk_settlement && val.values.pk_settlement.value;
                        }
                        if (pk_billtype) {
                            billtrack_billtype = pk_billtype;
                        } else {
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
                }
           
            }
        });  
        break;
        //联查凭证,验证已跳转，联查的是业务单据的凭证，结算单本身不产生凭证
        case 'linkVoucherBtn':
            // toast({ color: 'info', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000007') });/* 国际化处理： 联查凭证*/

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
            //来源系统<报销单生成单据独有，否则后台查询凭证查不到,因为报销单生成凭证pk重新定义了>
            let settle_pk = val.values.pk_settlement && val.values.pk_settlement.value;
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
            let checkeddata = checked;
            //数据校验
            if (checkeddata && checkeddata.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000005') });/* 国际化处理： 请选择1条子表数据*/
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
            for (let index = 0; index < restmoneyarr.length; index++) {
                let val = restmoneyarr[index];
                if (!val.pk_account && !val.pk_cashaccount) {
                    restmoneyarr.splice(index, 1);
                }
            }
            // if (restmoneyarr.length==0) {
            //     toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000076') });/* 国际化处理： 请选择有本方账户或现金账户的单据进行联查余额*/
            //     return;
            // }
            this.setState({
                showOriginalData: restmoneyarr,
                showOriginal: true,
            });
            break;
        //联查网银信息
        case 'linkNetBankBtn':
            // 联查网银信息就是浏览网银补录信息
            let neterror = [];
            selectedData.forEach((val) => {
                // 结算状态
                let settlestatus = val.values.settlestatus && val.values.settlestatus.value;
                // 签字人
                let pk_signer = val.values.pk_signer && val.values.pk_signer.value;
                if (settlestatus == '0') {
                    // 结算状态为未结算'0'为未结算，未结算不可联查网银信息
                    let billcode = val.values.billcode.value;
                    neterror.push(billcode);
                }
            })
            if (neterror && neterror.length > 0) {
                let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                    + neterror.join(', ')
                    + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000079'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
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
            // 联查前准备工作
            // 联查前准备工作
            let affirmpks = [];
            let affirmerror = [];
            // 控制只有支付失败和支付成功的才可以查询支付确认单
            selectedData.forEach((val) => {
                //此处可校验，挑选满足条件的进行操作
                let settlestatus = val.values.settlestatus.value;
                // 0为未结算
                // if (settlestatus == '0') {
                //     affirmerror.push(val.values.billcode.value);
                // } else {
                //     let pk = val.values.pk_settlement.value;
                // 主键数组
                //     affirmpks.push(pk);
                // }
                // 2018-10-29 问题号：87565 支付确认单不加判断，后台控制；
                let pk = val.values.pk_settlement.value;
                // 主键数组
                affirmpks.push(pk);
            });
            if (affirmpks.length == 0) {
                let content = '';
                if (affirmerror.length != 0) {
                    content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
                        + affirmerror.join(', ')
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
                        // toast({ color: 'success', content: '联查支付确认单查询出的数据成功' });
                        console.log(data.yurrefs, 'yurrefs');
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
            imageMap['pk_billid'] = selectedData[0].values.pk_busibill.value;//业务单据主键
            imageMap['pk_billtype'] = selectedData[0].values.pk_billtypeid.value;//单据类型
            imageMap['pk_tradetype'] = selectedData[0].values.pk_tradetype.value;//交易类型
            imageMap['pk_org'] = selectedData[0].values.pk_org.value;//组织
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
        // 输出按钮
        case 'outputBtn':
            let outputdata = {
                // funcode:'20521030',      //小应用编码
                nodekey: 'NCC360704SM',     //模板节点标识
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
        //修改
        case 'editBtn':
            //tm lidyu 20200227 结算卡片态修改冻结检查
            //修改权限校验
            if (saga_frozen == 1) {
                checkEditRight.call(this, pk);
                break;
            }
            //end
            else {
                let status = 'edit';
                this.props.cardTable.setStatus(this.tableId, status);
                this.props.form.setFormStatus(this.formId, status);
                this.props.button.setButtonVisible(Templatedata.allBtn, false);
                this.props.button.setButtonVisible(Templatedata.saveGroup, true);
                this.props.button.setButtonVisible(Templatedata.splitGroup, true);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                //begin tm lidyu 修改后 不显示驳回按钮 20200421
                this.props.button.setButtonVisible(Templatedata.back, false);
                //end lidyu
                props.setUrlParam({ 'status': 'edit' });
                // 组织多版本
                this.formMultiVersionProcess();
                // 设置编辑性
                this.setEditableByDirection();
                break;
            }
        //附件
        case 'additionBtn':
            //toast({ color: 'info', content: '功能待开发' });
            let additionbillno = selectedData[0].values.billcode.value;
            let additionbillid = selectedData[0].values.pk_settlement.value;

            this.setState({
                showUploader: !this.state.showUploader,
                target: null
            })
            this.billId = additionbillid;
            this.billno = additionbillno;
            break;
        //拆行
        case 'splitLineBtn':

            if (!checked || checked.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000009') });/* 国际化处理： 请选择一行子表数据！*/
                return;
            }
            let splitdata = deepClone(checked[0]);
            /****
             * bodyVO.setPk_detail(null);
			if(bodyVO.getDirection().equals(CmpConst.Direction_Pay)){
				bodyVO.setPay(new UFDouble(0.0, currDigit));
				bodyVO.setPaylocal(new UFDouble(0.0));
				bodyVO.setGrouppaylocal(new UFDouble(0.0));
				bodyVO.setGlobalpaylocal(new UFDouble(0.0));
				bodyVO.setPay_last(UFDouble.ZERO_DBL);
				bodyVO.setPaylocal_last(UFDouble.ZERO_DBL);
				bodyVO.setGlobalpaylocal_last(UFDouble.ZERO_DBL);
				bodyVO.setGrouppaylocal_last(UFDouble.ZERO_DBL);
			}
			if(bodyVO.getDirection().equals(CmpConst.Direction_Receive)){
				bodyVO.setReceive(new UFDouble(0.0, currDigit));
				bodyVO.setReceivelocal(new UFDouble(0.0));
				bodyVO.setGroupreceivelocal(new UFDouble(0.0));
				bodyVO.setGlobalreceivelocal(new UFDouble(0.0));

			} 
			bodyVO.setBankrelated_code(null);
			bodyVO.setSettlelineno(row + 1);
             * 
             * 
             */
            // 组装数据
            let bodyvo = splitdata.data.values;
            let splitindex = splitdata.index;
            splitdata.data.status = 2;
            bodyvo.pk_detail = { value: '' };
            let direction = bodyvo.direction.value;
            let bodypaymny = bodyvo.pay.value;
            let paydigit = bodyvo.pay.scale;//付款原币金额精度
            let receivedigit = bodyvo.receive.scale;//收款原币金额精度

            let zerovalue = { value: '0', scale: paydigit };
            let receive_zerovalue = { value: '0', scale: receivedigit };
            // 0收1付
            if (direction == 1) {
                bodyvo.pay = zerovalue;
                bodyvo.paylocal = zerovalue;
                bodyvo.grouppaylocal = zerovalue;
                bodyvo.globalpaylocal = zerovalue;
                bodyvo.pay_last = zerovalue;
                bodyvo.paylocal_last = zerovalue;
                bodyvo.globalpaylocal_last = zerovalue;
                bodyvo.grouppaylocal_last = zerovalue;
            }
            if (direction == 0) {
                bodyvo.receive = receive_zerovalue;
                bodyvo.receivelocal = receive_zerovalue;
                bodyvo.groupreceivelocal = receive_zerovalue;
                bodyvo.globalreceivelocal = receive_zerovalue;
            }
            let settlelineno = bodyvo.settlelineno.value;
            bodyvo.settlelineno = { value: settlelineno + 1 };
            this.props.cardTable.insertRowsAfterIndex(this.tableId, splitdata.data, splitindex);
            break;
        //合并行
        case 'combineLineBtn':
            combinbody.call(this);
            break;
        //制单，
        case 'makebillBtn':
            makebillBtn.call(this);
            break;
        //更多按钮组里的
        case 'refreshBtn':
            this.refreshCard(pk, null, true);
            break;
        case 'settlePayChangeBtn':
            // 支付变更
            if (!checked || checked.length == 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000063') });/* 国际化处理： 请选择需要支付变更的子表数据!*/
                return;
            }
            //新增-->支付变更只能表体单条进行操作
            if (!checked || checked.length > 1) {
                toast({ color: 'warning', content: '只能选择一条记录进行支付变更！' });/* 国际化处理： 请选择需要支付变更的子表数据!*/
                return;
            }
            let paychengevo = checked[0];
            // 子表的支付状态，2为支付失败
            let settlevalue = paychengevo.data.values.settlestatus.value;
            if (!settlevalue || settlevalue != '2') {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000064') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
                return;
            }
            let pk_org = paychengevo.data.values.pk_org.value;
            if (!pk_org) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000064') });/* 国际化处理： 支付失败的单据才可进行支付变更!*/
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
        default:
            break
    }
}

/**合并支付 */
const combinePay = function ({ data }) {
    this.setState({
        modelType: PAYMODEL_COMBINEPAY,
        modalValue: PAYMODEL_COMBINEPAY
    }, () => {
        this.loadBuLuInfo(data);
    });
}
/**
 * 合并行
 */
const combinbody = function () {
    let checked = this.props.cardTable.getCheckedRows(this.tableId);
    if (!checked || checked.length == 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000010') });/* 国际化处理： 请选择要合并的子表数据！*/
        return;
    }
    let indexs = [];
    checked.forEach((val, index) => {
        indexs.push(val.index);
    });
    let billdata = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    let data = {
        all: JSON.stringify(billdata),
        checked: JSON.stringify({ checked })
    };
    ajax({
        url: Templatedata.settlecombinline,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    //更新表头
                    this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
                    //更新表体
                    // begin 合并行保存金额校验报错，原因原拆分行没有传，修改为update更新,更新时更新对应行 majfd
                    // 返回数据中合并行在最后一条返回，即取combineNum-1.					
                    // this.props.cardTable.setTableData(this.tableId, data.body[this.tableId]);
                    let combineNum = res.data.body[this.tableId].rows.length;
                    let updateindex = indexs.shift();
                    this.props.cardTable.updateDataByIndexs(this.tableId, [{ index: updateindex, data: res.data.body[this.tableId].rows[combineNum - 1] }]);
                    this.props.cardTable.delRowsByIndex(this.tableId, indexs);
                    // end
                    this.toggleShowBydata(data.vos);
                    // 此处调用组织多版本展示，结算需要
                    this.formMultiVersionProcess();
                }
            }
        }
    });
}

/**网上转账 */
const netPay = function ({ data, selectedData }) {
    let new_error = [];
    selectedData.forEach((val) => {
        // 结算状态
        let settlestatus = val.values.settlestatus && val.values.settlestatus.value;
        // 签字人
        let pk_signer = val.values.pk_signer && val.values.pk_signer.value;
        if (pk_signer && (settlestatus == '0' || settlestatus == '2' || settlestatus == '6')) {
            // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付
            // 支付失败的单据可以继续进行网上支付
        } else {
            let billcode = val.values.billcode.value;
            new_error.push(billcode);
        }
    })
    if (new_error && new_error.length > 0) {
        let content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
            + new_error.join(', ')
            + (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000068'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
        toast({ color: 'warning', content: content });
        return;
    } else {
        // 此处需要先校验是否可以网银支付，然后再弹框
        ajax({
            url: Templatedata.netpayValidate,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    // 成功即代表校验通过，否则就会抛出异常数据
                    promptBox({
                        color: "warning",
                        title: this.getLangCode('000066'),   /// this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000066'),/* 国际化处理： 网上支付*/
                        content: this.getLangCode('000067'), // this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000067'),/* 国际化处理： 确定进行网上支付?*/
                        beSureBtnClick: this.netPayProcess.bind(this), //使用call直接執行了
                    });
                }
            }
        });
    }
}

/**结算 */
const settlement = function ({ data, setlle_status, pk }) {
    //单据编号
    let setlle_billno = this.props.form.getFormItemsValue(this.formId, 'billcode').value;
    if (setlle_status == 5) {
        let before = this.getLangCode('000029');/* 国际化处理： 单据编号 */
        let after = this.getLangCode('000036');/* 国际化处理：  不可结算！*/
        let content = before + ':' + setlle_billno + after;
        toast({ color: 'danger', content: content });
        return;
    }
    ajax({
        url: Templatedata.settlesettle,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    toast({ color: 'warning', content: data.message.errmsg[0] });
                } else {
                    toast({ color: 'success', content: this.getLangCode('000002') });/* 国际化处理： 结算成功*/
                }
                if (data.vos) {
                    // this.setFormAndTableData(data.voscard);
                    this.props.beforeUpdatePage();//打开开关
                    if (data.vos.head) {
                        this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
                        //页签赋值
                        let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
                        let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
                        this.billno = billno;
                        this.billId = billId;// 单据id，用于刷新卡片页，附件上传
                        // 更新缓存
                        updateCache(
                            'pk_settlement',
                            billId,
                            res.data.vos,
                            this.formId,
                            this.listDataSource,
                            res.data.vos.head[this.formId].rows[0].values
                        );
                    }
                    if (data.vos.body) {
                        // this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
                        api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
                        //end tangleic
                        this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
                    }

                    this.props.setUrlParam({
                        status: 'browse'
                    });
                    // 此处均由卡片页本页面设置按钮显隐性
                    this.toggleShowBydata(null);
                    // 设置编辑性，此处先不做处理，因为会报错
                    // this.setEditableByDirection();
                    // 此处调用组织多版本展示，结算需要
                    this.formMultiVersionProcess();
                    this.props.updatePage(this.formId, this.tableId);//关闭开关
                } else {
                    this.refreshCard(pk, null, true);//刷新页面
                }
            }
        }
    });
}

/**
 * 签字动作
 * @author tangleic 
 * @date 20200104 签字增加预算异常交互
 */
const signAction = function (data, callback) {
    // let signData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    //签字
    ajax({
        url: Templatedata.settlesign,
        data: data,
        success: (res) => {
            //begin tm lidyu 解决刷新的pk未定义报错 20200424
            let pk1 = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
            //end lidyu 20200424
            let { success, data } = res;
            if (success) {
                let haswarninfo = false;
                
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    toast({ color: 'warning', content: data.message.errmsg[0] });
                    //begin tm tangleic 20200104 成功提示信息放到后面判断是否有预算提示后再做
                    haswarninfo = true;
                    // } else {
                    //     toast({ color: 'success', content: this.getLangCode('000000') });/* 国际化处理： 结算成功*/
                    //end tangleic 20200104
                }
                if (data.vos) {
                    //begin tm tangleic 20200104 签字增加回调逻辑以支持预算的异常交互
                    let hasTbbInfo = false;
                    if (callback && typeof callback == 'function') {
                        //是否有预算提示信息，没有才提示操作成功
                        hasTbbInfo = callback(res);
                    }
                    //没有预算消息 也没有异常消息 提示操作成功
                    if (!hasTbbInfo && !haswarninfo) {
                        let succMsg = api.loadMultiLang(this.props, '36070-000036')/**签字 */ + api.loadMultiLang(this.props, '36070-000016') /**成功 */;
                        toast({ color: 'success', content: succMsg });
                    }
                    //end tangleic 20200104
                    this.props.beforeUpdatePage();//打开开关
                    if (data.vos.head) {
                        this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
                        //页签赋值
                        let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
                        let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
                        this.billno = billno;
                        this.billId = billId;// 单据id，用于刷新卡片页，附件上传
                        // 更新缓存
                        updateCache(
                            'pk_settlement',
                            billId,
                            res.data.vos,
                            this.formId,
                            this.listDataSource,
                            res.data.vos.head[this.formId].rows[0].values
                        );
                    }
                    if (data.vos.body) {
                        // this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
                        api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
                        //end tangleic
                        this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
                    }

                    this.props.setUrlParam({
                        status: 'browse'
                    });
                    // this.refreshCard(pk, null, true);
                    // 此处均由卡片页本页面设置按钮显隐性
                    this.toggleShowBydata(null);
                    // 设置编辑性，此处先不做处理，因为会报错
                    // this.setEditableByDirection();
                    // 此处调用组织多版本展示，结算需要
                    this.formMultiVersionProcess();
                    this.props.updatePage(this.formId, this.tableId);//关闭开关
                } else {
                    this.refreshCard(pk1, null, true);
                }
            }
        }
    });
}

/**
 * 取消签字动作
 */
const unSignAction = function (data, callback) {
    ajax({
        url: Templatedata.settleantisign,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //begin tm tangleic 20200106 有异常信息时不再提示操作成功
                let haswarninfo = false;
                //end tangleic 
                if (data && data.message && data.message.errmsg && data.message.errmsg.length > 0) {
                    toast({ color: 'danger', content: data.message.errmsg[0] });

                    //begin tm tangleic 20200106 有异常信息时不再提示操作成功
                    haswarninfo = true;
                    //end tangleic

                    //begin tm tangleic 20200104 成功提示信息放到后面判断是否有预算提示后再做 
                    // } else {
                    // toast({ color: 'success', content: this.getLangCode('000001') });/* 国际化处理： 结算成功*/
                    //end tangleic
                }
                if (data.vos) {
                    //begin tm tangleic 20200104 签字增加回调逻辑以支持预算的异常交互
                    let hasTbbInfo = false;
                    if (callback && typeof callback == 'function') {
                        //是否有预算提示信息，没有才提示操作成功
                        hasTbbInfo = callback(res);
                    }
                    //没有预算消息 也没有异常消息 提示操作成功
                    if (!hasTbbInfo && !haswarninfo) {
                        let succMsg = api.loadMultiLang(this.props, '36070-000037')/**取消签字 */ + api.loadMultiLang(this.props, '36070-000016') /**成功 */;
                        toast({ color: 'success', content: succMsg });
                    }
                    //end tangleic 20200104
                    this.props.beforeUpdatePage();//打开开关
                    if (data.vos.head) {
                        this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
                        //页签赋值
                        let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
                        let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
                        this.billno = billno;
                        this.billId = billId;// 单据id，用于刷新卡片页，附件上传
                        // 更新缓存
                        updateCache(
                            'pk_settlement',
                            billId,
                            res.data.vos,
                            this.formId,
                            this.listDataSource,
                            res.data.vos.head[this.formId].rows[0].values
                        );
                    }
                    if (data.vos.body) {
                        // this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        //begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
                        api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.vos.body[this.tableId] });
                        //end tangleic
                        this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
                    }

                    this.props.setUrlParam({
                        status: 'browse'
                    });
                    // 此处均由卡片页本页面设置按钮显隐性
                    this.toggleShowBydata(null);
                    // 设置编辑性，此处先不做处理，因为会报错
                    // this.setEditableByDirection();
                    // 此处调用组织多版本展示，结算需要
                    this.formMultiVersionProcess();
                    this.props.updatePage(this.formId, this.tableId);//关闭开关
                } else {
                    this.refreshCard(pk, null, true);
                }
            }
        }
    });
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/