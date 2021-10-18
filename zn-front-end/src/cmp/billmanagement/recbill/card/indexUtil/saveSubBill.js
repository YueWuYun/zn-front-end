/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
import { saveCommit } from "../../../../../tmpub/pub/util";
import appBase from '../../base';
const { api } = appBase;
//缓存
let { updateCache, addCache } = cardCache;

/**
 * [外币兑换]-保存提交
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveSubBill = function () {
    // let url = '/nccloud/cmp/recbill/recbillsavesubmit.do'//新增保存提交
    // if (this.props.getUrlParam('status') === 'edit') {
    //     url = '/nccloud/cmp/recbill/recbilleditsubmit.do'//修改保存提交
    // }
    // let saveSubStatus = this.props.getUrlParam('status');
    // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    // //上行流量优化
    // let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
    // let savesubmitBtnflag = this.props.form.isCheckNow(this.formId);
    // let sb_tableflag = this.props.cardTable.checkTableRequired(this.tableId);
    // if (savesubmitBtnflag && sb_tableflag) {
    //     //关联结算信息保存方法url
    //     let settlement_src_sub = this.props.getUrlParam('src');
    //     console.log(settlement_src_sub, 'from_settle_to_save');
    //     if (settlement_src_sub) {
    //         url = '/nccloud/cmp/recbill/settlesavesub.do'//新增保存提交
    //         CardData = {
    //             'billcard': CardData,
    //             'pk': this.settlepkinfo//结算信息pk
    //         }
    //     }
    //     ajax({
    //         url: url,
    //         data: CardData,
    //         success: (res) => {
    //             let { success, data } = res;
    //             //提交--指派
    //             if (data && data.workflow &&
    //                 (data.workflow == 'approveflow' ||
    //                     data.workflow == 'workflow')) {
    //                 //渲染数据
    //                 if (data.billcard) {
    //                     if (res.data.billcard.body) {
    //                         this.props.cardTable.setTableData(this.tableId, res.data.billcard.body[this.tableId]);
    //                     }
    //                     if (res.data.billcard.head) {
    //                         //预算预警提示
    //                         if (res.data.billcard.head[this.formId].rows[0].values.ntberrmsg &&
    //                             res.data.billcard.head[this.formId].rows[0].values.ntberrmsg.value) {
    //                             let reform_message = res.data.billcard.head[this.formId].rows[0].values.ntberrmsg.value;
    //                             toast({ color: 'warning', content: reform_message });
    //                         }
    //                         this.props.form.setAllFormValue({ [this.formId]: res.data.billcard.head[this.formId] });
    //                         let source_Flag = res.data.billcard.head[this.formId].rows[0].values.source_flag.value;
    //                         let billno = res.data.billcard.head[this.formId].rows[0].values.bill_no.value;
    //                         let billstatue = res.data.billcard.head[this.formId].rows[0].values.bill_status.value;
    //                         let pk_recbill = res.data.billcard.head[this.formId].rows[0].values.pk_recbill.value;
    //                         setSourceFlag.call(this, source_Flag);
    //                         this.billno = billno;
    //                         //增加缓存
    //                         let firstStatus = this.props.getUrlParam('status');
    //                         if (!firstStatus || firstStatus == 'add' || firstStatus == 'copy') {
    //                             //新增缓存
    //                             addCache(pk_recbill, res.data.billcard, this.formId, this.dataSource, res.data.billcard.head[this.formId].rows[0].values);
    //                         } else {
    //                             //更新缓存
    //                             updateCache(this.pkname, pk_recbill, res.data.billcard, this.formId, this.dataSource, res.data.billcard.head[this.formId].rows[0].values);
    //                         }
    //                         //跳转页面
    //                         this.props.setUrlParam({
    //                             status: 'browse',
    //                             id: pk_recbill,
    //                             billno: billstatue,
    //                             pagecode: this.pageId
    //                         });
    //                         this.toggleShow();//切换页面状态
    //                     }
    //                 }
    //                 //弹出指派框
    //                 this.compositedata = data;
    //                 this.setState({
    //                     isSaveSub: true,//保存提交标识
    //                     compositedisplay: true
    //                 });

    //             } else if (data) {
    //                 if (res.success) {
    //                     if (res.data) {

    //                         if (res.data.head) {
    //                             let return_status = res.data.head[this.formId].rows[0].values.bill_status.value;
    //                             if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
    //                                 let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
    //                                 if (return_status && return_status == -10) {
    //                                     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') + reform_message });
    //                                 } else {
    //                                     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') + reform_message });/* 超额提示预警，预算提示*/
    //                                 }
    //                             } else {
    //                                 if (return_status && return_status == -10) {
    //                                     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') });
    //                                 } else {
    //                                     toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') });/* 超额提示预警，预算提示*/
    //                                 }
    //                             }
    //                             this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
    //                             let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
    //                             this.billno = subbillno;
    //                         }

    //                         //根据后台返回的数据进行缓存处理<pass>
    //                         if (res.data.body && res.data.body[this.tableId]) {
    //                             let body = res.data.body;//差异缓存处理
    //                             body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
    //                             if (body) {
    //                                 res.data.body = body;//差异缓存处理
    //                             }
    //                         }
    //                         //跳转页面
    //                         let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
    //                         let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
    //                         //增加缓存
    //                         let card_sub_status = this.props.getUrlParam('status');
    //                         if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
    //                             //新增缓存
    //                             addCache(sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
    //                         } else {
    //                             //更新缓存
    //                             updateCache(this.pkname, sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
    //                         }
    //                         this.props.setUrlParam({
    //                             status: 'browse',
    //                             id: sub_pk_recbill,
    //                             billno: sub_billstatue,
    //                             pagecode: this.pageId
    //                         });
    //                         let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
    //                         setSourceFlag.call(this, source_Flag);
    //                         this.toggleShow();//切换页面状态
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }
    saveCommitMicro.call(this, this.props);
  


}

/**保存提交 */
const saveCommitMicro = function (props, extParam) {
     if(!extParam){

        extParam={};
     }
    let settlement_src_sub = this.props.getUrlParam('src');
    if (settlement_src_sub) {
        extParam['pk'] = this.settlepkinfo//结算信息pk
    }

    saveCommit(props, {
        pageCode: this.pageId,
        headCode: this.formId,
        bodyCode: this.tableId,
        url: '/nccloud/cmp/recbill/recbillsavesubmitmicro.do',
        assign: this.getConstAssginUsedr,
        showAssignFunc: (res) => {
            let { data } = res;
            let { workflow } = data;
            //有指派信息，则指派，没有则重绘界面
            if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                //弹出指派框
                this.compositedata = res.data;
                this.setState({
                    isSaveSub: true,//保存提交标识
                    compositedisplay: true
                });
            }
        },
        updateViewFunc: (res) => {
            if (res.data.head) {
                let return_status = res.data.head[this.formId].rows[0].values.bill_status.value;
                if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
                    let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                    if (return_status && return_status == -10) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') + reform_message });
                    } else {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') + reform_message });/* 超额提示预警，预算提示*/
                    }
                } else {
                    if (return_status && return_status == -10) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') });
                    } else {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') });/* 超额提示预警，预算提示*/
                    }
                }

                //begin tm tangleic 20200220 增加预算提示信息
                // api.comm.showTbbMsg({ props: this.props, row: res.data.head[this.formId].rows[0] });
                //end tm tangleic

                this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
                this.billno = subbillno;
            }

            //根据后台返回的数据进行缓存处理<pass>
            if (res.data.body && res.data.body[this.tableId]) {
                let body = res.data.body;//差异缓存处理
                body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
                if (body) {
                    res.data.body = body;//差异缓存处理
                }
            }
 
            //跳转页面
            let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
            let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
            //增加缓存
            let card_sub_status = this.props.getUrlParam('status');
            if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
                //新增缓存
                addCache(sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
            } else {
                //更新缓存
                updateCache(this.pkname, sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
            }
            this.setState({
                compositedisplay: false
            });
            this.compositedata = null;
            this.getConstAssginUsedr=null;
            this.props.setUrlParam({
                status: 'browse',
                id: sub_pk_recbill,
                billno: sub_billstatue,
                pagecode: this.pageId
            });
            let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
            setSourceFlag.call(this, source_Flag);
            this.toggleShow();//切换页面状态

        },
        saveValidate:null,
        //拓展参数
        extParam: extParam
    })
}

/**保存动作更新界面数据 */
const saveUpdateView = function (props, res, callback) {
    //界面状态
    let status = props.getUrlParam('status');
    let { data } = res;
    let { head, body } = data;
    if (!head) {
        return;
    }
    //更新表头数据
    props.form.setAllFormValue({ [PAYBILL_CONST.card_from_id]: head[PAYBILL_CONST.card_from_id] });
    //更新表体(兼顾差异化和非差异化)
    if (body) {
        body = updateBody(props, body);
        if (body) {
            data.body = body;
        }
    }
    let pk = head[PAYBILL_CONST.card_from_id].rows[0].values[PAYBILL_CONST.paybill_pkname].value;
    //新增时，向缓存中追加数据
    if (PAYBILL_CONST.add == status) {
        cardCache.addCache(pk, data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
    }
    //其余更新缓存中的数据
    else {
        cardCache.updateCache(PAYBILL_CONST.paybill_pkname, pk, data, PAYBILL_CONST.card_from_id, PAYBILL_CONST.paybillCacheKey);
    }
    //刷新界面
    //repaintView(props, cons.viewmode.browse, { id: pk })
    //执行回调
    if (callback && (typeof callback == 'function')) {
        callback();
    }
}

/**
 * 更新表体，兼容差异化处理
 * @param {*} props 
 * @param {*} body 
 */
export const updateBody = function (props, body) {
    //rowid存在则按照差异化处理
    if (body[PAYBILL_CONST.card_table_id] && body[PAYBILL_CONST.card_table_id].rows && body[PAYBILL_CONST.card_table_id].rows[0] && body[PAYBILL_CONST.card_table_id].rows[0].rowid) {
        body[PAYBILL_CONST.card_table_id] = props.cardTable.updateDataByRowId(PAYBILL_CONST.card_table_id, body[PAYBILL_CONST.card_table_id]);
    }
    //否则直接更新表体
    else {
        props.cardTable.setTableData(PAYBILL_CONST.card_table_id, body[PAYBILL_CONST.card_table_id]);
    }
    return body;
}

/*TeytldWPnXV5g4CoxrgXxudYLNciVl8jHUEkPnPg+KDgaT/WDjRKRZw9XdXltUEm*/