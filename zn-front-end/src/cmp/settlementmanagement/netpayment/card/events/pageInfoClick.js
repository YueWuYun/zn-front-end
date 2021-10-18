/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let page_id=Templatedata.card_pageid;

export default function (props, pks) {
    console.log(pks);
//    let urlbillno = props.getUrlParam("billno");//单据状态card分页使用
    // 后台还没更新，暂不可用
    if(pks){
        // 动态修改地址栏中的id的值
        // props.setUrlParam(pks)
        // 直接跳转页面交由页面处理
        // props.linkTo('/cmp/settlementmanagement/settlement/card/index.html', {
        //     status: 'browse',
        //     id: pks,
        // });
        props.setUrlParam(pks);
        this.refreshCard(pks);
        // ajax({
        //     url: '/nccloud/cmp/settlement/settlecardquery.do',
        //     data: data,
        //     success: (res) => {
        //         if (res.data) {
        //             let billno ='';
        //             let urlbillno = '';
        //             let billId = '';
        //             if (res.data.head) {
        //                  billno = res.data.head[this.formId].rows[0].values.billcode.value;
        //                  billid = res.data.head[this.formId].rows[0].values.pk_settlement.value;
        //                  urlbillno = res.data.head[this.formId].rows[0].values.bill_status.value;
        //                  this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
        //             }
        //             if (res.data.bodys) {
        //                 this.props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);
                       
        //             }
        //             // props.setUrlParam(pks)//动态修改地址栏中的id的值
        //             // props.linkTo('/cmp/billmanagement/recbill/card/index.html', {
        //             //     status: 'browse',
        //             //     id: pks,
        //             //     billno: urlbillno
        //             // });
        //             //window.location.href = "/cmp/billmanagement/recbill/card#status=browse&id="+pks+"&billno="+urlbillno;
        //             this.componentDidMount();
        //             this.setState({
        //                 billno: billno,
        //                 billId:billId
        //             });
                    
        //         } else {
        //             this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
        //             this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    
        //         }
        //     }
        // });
    }
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/