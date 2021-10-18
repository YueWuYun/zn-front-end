/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { cardCache } from "nc-lightapp-front";//缓存相关
let { getCacheById, updateCache } = cardCache;//缓存相关

let page_id = Templatedata.card_pageid;
export default function (props, pks) {
    console.log(pks);
    /*
    * pks：数据主键的值
    * dataSource: 缓存数据命名空间
    */
    let cardData = getCacheById(pks, this.dataSource);
    
    if (cardData) {
        props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
        if (cardData.body == null) {
            props.cardTable.setTableData(this.tableId, { rows: [] });
        } else {
            props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
        }
        //页签赋值
        let billno_1 = cardData.head[this.formId].rows[0].values.bill_no.value;
        let urlbillno_1 = cardData.head[this.formId].rows[0].values.bill_status.value;
        this.billno = billno_1;//单据编号
        props.setUrlParam({
            status: 'browse',
            id: pks,
            billno: urlbillno_1,
            pagecode: this.pageId
        });
        this.toggleShow();//切换页面状态
    } else {
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
                            if (res.data.head[this.formId].rows[0].values.trade_type.value) {
                                pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
                            }
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                             //来源系统---翻译----赋值
                             let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                             this.source_flag(source_Flag);
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);

                        }
                        this.billno = billno;//单据编号
                        props.setUrlParam({
                            status: 'browse',
                            id: pks,
                            billno: urlbillno,
                            pagecode: pagecode
                        });
                        this.toggleShow();//切换页面状态
                        //更新缓存
                        updateCache(this.pkname, pks, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                    } else {
                        this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });

                    }
                }
            });
        }
    }


}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/