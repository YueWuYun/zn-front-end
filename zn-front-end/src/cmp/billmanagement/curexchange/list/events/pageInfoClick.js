/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { queryNavValue } from "./queryNavValue";
import buttonUsability from './buttonUsability';
/**
 * [外币兑换]-列表分页
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export default function pageInfoClick(props, config, pks) {
    this.props.table.selectAllRows(this.tableId, false);//清空所选行数
    buttonUsability.call(this,this.props,'');//列表按钮显影性
    let data = {
        "pks": pks,
        "pageid": this.pageCode
    };
    // queryNavValue.call(this);//查询数据，分组给页签赋值
    ajax({
        url: Templatedata.pageinfo_query,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(this.tableId, data[this.tableId]);
                } else {
                    props.table.setAllTableData(this.tableId, { rows: [] });
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/