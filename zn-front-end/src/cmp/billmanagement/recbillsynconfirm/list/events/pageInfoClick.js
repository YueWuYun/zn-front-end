/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
export default function (props, config, pks) {
    //分页根据pks查询数据
    let data = {
        "pks": pks,
        "pageid": this.pageId
    };
    ajax({
        url: '/nccloud/cmp/recbill/recbillquerybyids.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data){
                    this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                }else{
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
                
            }
        }
    });
  
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/