/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { cardCache } from "nc-lightapp-front";//缓存相关
let { getCacheById, updateCache } = cardCache;//缓存相关

let formId = Templatedata.card_formid;
let pageid = Templatedata.card_pageid;

export default function (props, pks) {

    let cardData = getCacheById(pks, this.dataSource);
    if (cardData) {
        props.form.setAllFormValue({ [formId]: cardData[formId] });
        //页签赋值
        let billno_1 = cardData[formId].rows[0].values.vbillno.value;
        let urlbillno_1 = cardData[formId].rows[0].values.busistatus.value;
        this.billno = billno_1;
        props.setUrlParam({
            status: 'browse',
            id: pks,
            pk: urlbillno_1
        });
        this.toggleShow();//切换页面状态
    } else {
        let pkArr = [];
        if (pks) {
            pkArr.push(pks);//主键数组
            let data = {
                "pks": pkArr,
                "pageid": pageid
            };
            ajax({
                url: '/nccloud/cmp/curexchange/curexchangequerybyids.do',
                data: data,
                success: (res) => {
                    //data要看返回的id，而不是后台设置的id
                    if (res.data) {
                        props.form.setAllFormValue({ [formId]: res.data[formId] });
                        if (res.data[formId].rows) {
                            //页签赋值
                            let billno = res.data[formId].rows[0].values.vbillno.value;
                            let urlbillno = res.data[formId].rows[0].values.busistatus.value;
                            this.billno = billno;
                            props.setUrlParam({
                                status: 'browse',
                                id: pks,
                                pk: urlbillno
                            });
                            this.toggleShow();//切换页面状态
                        }
                        //更新缓存
                        updateCache(this.pkname, pks, res.data, formId, this.dataSource, res.data[formId].rows[0].values);
                    } else {
                        this.props.form.setAllFormValue({ [formId]: { rows: [] } });
                    }

                }
            });
        }
    }


}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/