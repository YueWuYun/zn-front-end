/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import {Templatedata} from "../../config/Templatedata";//配置的id和area信息
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.link_list_pageid;
export default function (props, config, pks) {
    //分页根据pks查询数据
    let data = {
        "pks": pks,
        "pageid": pageId
    };
    ajax({
        url: '/nccloud/cmp/recbill/recbillquerybyids.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data){
                    props.table.setAllTableData(tableId, data[tableId]);
                }else{
                    props.table.setAllTableData(tableId, {rows:[]});
                }
                
            }
        }
    });
  
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/