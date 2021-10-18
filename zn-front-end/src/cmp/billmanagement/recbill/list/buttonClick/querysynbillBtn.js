/*dVLeLazxjl4KZjcASMqnKJA9M+xSxvaaXiIrxBi/3SyNJqh7eTtrRupf0XlCooHL*/
import { ajax, cacheTools, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款]-联查付款结算按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const querysynbillBtn = function () {
    let querysynbillBtnData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (querysynbillBtnData.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000074') });/* 国际化处理： 请选择单条数据，联查协同单据!*/
        return;
    }
    let querysynbillArr = [];
    //处理选择数据
    querysynbillBtnData.forEach((val) => {
        if (val.data.values.pk_recbill && val.data.values.pk_recbill.value != null) {
            let pk = val.data.values.pk_recbill.value;
            querysynbillArr.push(pk);//主键
        }
        if (val.data.values.pk_upbill && val.data.values.pk_upbill.value != null && val.data.values.pk_upbill.value != '~') {
            let uppk = val.data.values.pk_upbill.value;
            querysynbillArr.push(uppk);//上后主键
        }
    });
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
                //处理联查协同单据
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