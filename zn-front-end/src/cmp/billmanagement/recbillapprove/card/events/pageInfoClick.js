/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let page_id = Templatedata.card_pageid;

export default function (props, pks) {
    console.log(pks);
    /**
     * 根据pagecode加载不同模版
     */
    if (props.getUrlParam('pagecode')) {
        page_id = props.getUrlParam('pagecode');
    }
    if (pks) {
        let dataArr = [];
        dataArr.push(pks);//主键数组
        let data = {
            "pks": dataArr,
            "pageid": page_id
        };
        ajax({
            url: '/nccloud/cmp/recbill/recbillquerycardbyid.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    let billno = '';
                    let urlbillno = '';
                    let pagecode = page_id;
                    if (res.data.head) {
                        billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                        urlbillno = res.data.head[this.formId].rows[0].values.bill_status.value;
                        /**
                         * 交易类型编码--->pagecode
                         */
                        if(res.data.head[this.formId].rows[0].values.trade_type.value){
                            pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
                        }
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (res.data.bodys) {
                        this.props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);

                    }
                    props.linkTo('/cmp/billmanagement/recbill/card/index.html', {
                        status: 'browse',
                        id: pks,
                        billno: urlbillno,
                        pagecode: pagecode
                    });
                    this.billno=billno;
                    this.toggleShow();
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });

                }
            }
        });
    }

}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/