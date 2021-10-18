/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax,toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { cardCache } from "nc-lightapp-front";//缓存相关
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
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
        this.billno = billno_1;
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
                            setSourceFlag.call(this, source_Flag);
                            // this.source_flag(source_Flag);
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);

                        }
                        this.billno = billno;
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
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });

                    }
                },
                error: (res) => {
                    //并发处理，他人删除vo导致查询不到数据,直接跳转到空白页面
                    toast({ color: 'warning', content: res.message });/* 国际化处理： 并发错误,单据未查询到!*/
                    let delpk = pks;
                    if (delpk) {
                        this.deleteId = delpk;//删除单据pk
                    }
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    this.props.setUrlParam({
                        status: 'browse',
                        id: '',
                        billno: '',
                        pagecode: this.pageId
                    });
                    this.billno = null;
                    this.toggleShow();//切换页面状态
                    this.deleteCacheData();//删除list缓存
                    // this.cancleSkyPage();//跳转空白页面
                }
            });
        }
    }


}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/