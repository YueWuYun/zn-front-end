/*dVLeLazxjl4KZjcASMqnKJA9M+xSxvaaXiIrxBi/3SyNJqh7eTtrRupf0XlCooHL*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-联查协同单据
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const querysynbillBtn = function () {
    let querysynbillArr = [];
    let querysynbillBtn_pk_upbill, querysynbillBtn_pk_recbill
    if (this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        querysynbillBtn_pk_recbill = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
        querysynbillArr.push(querysynbillBtn_pk_recbill);//上后主键
    }
    if (this.props.form.getFormItemsValue(this.formId, 'pk_upbill').value) {
        querysynbillBtn_pk_upbill = this.props.form.getFormItemsValue(this.formId, 'pk_upbill').value;
        querysynbillArr.push(querysynbillBtn_pk_upbill);//上后主键
    }

    if (!(querysynbillBtn_pk_upbill || querysynbillBtn_pk_recbill)) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    /**
         * 优先查询是否存在协同单据，不存在直接报错
         */
    let isAction = false;
    let confirmdate = {
        pks: querysynbillArr
    }
    ajax({
        url: '/nccloud/cmp/recbill/linkbillconfirm.do',
        data: confirmdate,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //联查协同数据
                cacheTools.set(Templatedata.synbill_cachekey, querysynbillArr);
                let querysynbillBtn_appOption = {
                    code: Templatedata.synbill_paybillcode,
                    name: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000015'),/* 国际化处理： 付款结算管理*/
                    pk_appregister: Templatedata.synbill_paybillappid
                };
                let querysynbillBtn_type = {
                    type: null
                };
                let querysynbillBtn_query = {
                    status: 'browse',
                    src: Templatedata.synbill_paybillsrc,
                    callback: '1'
                }
                this.props.openTo('/cmp/billmanagement/paybill/linkcard/index.html',
                    {
                        appcode: Templatedata.synbill_paybillcode,
                        pagecode: Templatedata.synbill_pagecode,
                        status: 'browse',
                        src: Templatedata.synbill_paybillsrc,
                        name: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000016'),/* 国际化处理： 付款结算联查*/

                    });
            }
        }
    });
}

/*dVLeLazxjl4KZjcASMqnKJA9M+xSxvaaXiIrxBi/3SyNJqh7eTtrRupf0XlCooHL*/