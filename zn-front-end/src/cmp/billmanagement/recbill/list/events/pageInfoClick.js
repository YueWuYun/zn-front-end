/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import buttonUsability from './buttonUsability';
export default function pageInfoClick(props, config, pks) {
    //清空所选行数
    this.props.table.selectAllRows(this.tableId, false);
    //列表按钮显影性
    buttonUsability.call(this, this.props, '');
    //分页根据pks查询数据
    let data = {
        "pks": pks,
        "pageid": this.pageId
    };
    // queryNavValue.call(this);//查询数据，分组给页签赋值
    ajax({
        url: '/nccloud/cmp/recbill/recbillquerybyids.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });

}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/