/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import {Templatedata} from "../../config/Templatedata";//配置的id和area信息

let formId =Templatedata.card_formid;
let tableId =Templatedata.card_tableid;
let pageid = Templatedata.card_pageid;

export default function (props, pks) {
    console.log(pks);//打印日志。
    // 后台还没更新，暂不可用
     let pkArr = [];
     if(pks){
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
                    this.props.form.setAllFormValue({ [formId]: res.data[tableId] });
                    if (res.data[tableId].rows) {
                        //页签赋值
                        let billno = res.data[tableId].rows[0].values.vbillno.value;
                        let urlbillno = res.data[tableId].rows[0].values.busistatus.value;
                        // window.location.href = "/cmp/billmanagement/curexchange/card/index.html#status=browse&id="+pks+"&pk="+urlbillno;
                        props.linkTo('/cmp/billmanagement/curexchange/card/index.html', {
                            status: 'browse',
                            id: pks,
                            pk:urlbillno
                          })
                        this.componentDidMount();
                        this.setState({
                            billno: billno
                            
                        });
                    }
                    props.setUrlParam(pks)//动态修改地址栏中的id的值
                } else {
                    this.props.form.setAllFormValue({ [formId]: { rows: [] } });
                }
   
            }
        });
     }
     
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/