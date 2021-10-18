/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';

export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    //let searchVal = props.search.getAllSearchData('search');
    let tableId = 'table';
    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        "pks": pks,
        "pageid": "36070AIPSSC_L01"
    };
    ajax({
        url: '/nccloud/cmp/release/sscreleasepagequery.do',
        data: data,
        async: true,
        success: function (res) {
            props.table.setAllTableData('table', res.data[tableId])
        }
    });
}
/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/