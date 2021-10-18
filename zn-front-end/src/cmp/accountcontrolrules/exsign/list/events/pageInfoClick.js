/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';

export default function (val) {
    let pageInfo = this.props.editTable.getTablePageInfo(this.tableId);
    let searchVal = this.props.search.getAllSearchData('20520100');
    let data={
        "conditions":searchVal,
        "pageInfo":pageInfo,
        "code": "20521030",
        // "queryAreaCode":"20521030",
        // "oid":"1001Z510000000003O6T",
     }
    //得到数据渲染到页面
    let that = this;
    // ajax({
    //     url: '/nccloud/reva/revecont/query.do',//'/nccloud/reva/search/query.do',
    //     data: data,
    //     success: function (res) {
    //         that.props.table.setAllTableData('pobdoc', res.data.revecont_b)
    //     }
    // });
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/