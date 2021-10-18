/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
let { NCMessage } = base;
let tableid = 'table';
let pageId = '360701BCS_L01';
export default function tableButtonClick(props, key, text, record, index) {
    switch (key) {
        // 修改
        case 'Ledit':
            props.pushTo("/card", {
                status: 'edit',
                from: 'list',
                id: record.pk_bconfer.value
            });
            break;
        // 删除
        case 'Ldelete':
            let indexArr = [];
            let deleteArr = [];
            indexArr.push(index);
            let deldata = {
                ts: record.ts.value,
                pk: record.pk_bconfer.value
            };
            deleteArr.push(deldata);
            let data = { deldata: deleteArr };
            let that = this;
            ajax({
                url: '/nccloud/cmp/billmanagement/conferdelete.do',
                data,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        props.table.deleteTableRowsByIndex(tableid, indexArr)
                        toast({ content: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000007'), color: 'success' });/* 国际化处理： 删除成功*/
                    }
                }
            });
            break;
    }
}
//刷新页面数据方法
function refreshFun(props) {
    let searchVal = props.search.getAllSearchData(searchid);
    let data = {
        conditions: searchVal,
        pageInfo: {
            currentPageIndex: 0,
            pageSize: 10,
            total: 0,
            pageCount: 0
        }
    };

    ajax({
        url: '/nccloud/cmp/billmanagement/conferquery.do',
        data: data,
        success: function (res) {
            props.table.setAllTableData(tableid, res.data['0001']);
        }
    });
}


/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/