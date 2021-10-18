/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
let page_id=Templatedata.link_card_pageid;

export default function (props, pks) {
    console.log(pks);
//    let urlbillno = props.getUrlParam("billno");//单据状态card分页使用
    // 后台还没更新，暂不可用
    if(pks){
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
                    let billno ='';
                    let urlbillno = '';
                    if (res.data.head) {
                         billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                         urlbillno = res.data.head[this.formId].rows[0].values.bill_status.value;
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                         //来源系统---翻译----赋值
                         let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        //  this.source_flag(source_Flag);
                         setSourceFlag.call(this,source_Flag);
                    }
                    if (res.data.bodys) {
                        this.props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);
                       
                    }
                    
                    // props.setUrlParam(pks)//动态修改地址栏中的id的值
                     // window.location.href = "/cmp/billmanagement/recbill/card#status=browse&id="+pks+"&billno="+urlbillno;
                    props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
                        status: 'browse',
                        id: pks,
                        billno: urlbillno,
                        pagecode:this.pageId
                    });
                    this.toggleShow();
                   
                    this.setState({
                        billno: billno

                    });
                    
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    
                }
            }
        });
    }
   
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/