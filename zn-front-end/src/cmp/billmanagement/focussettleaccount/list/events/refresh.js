/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import {  ajax, toast } from 'nc-lightapp-front';
import { buttonUsability } from './';
/**
 * [集中结账]-列表刷新[如果查询不到数据就不用提示]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const refresh = function () {
    let pageinfo = this.props.table.getTablePageInfo(this.tableId);//分页
    let searchVal = this.props.search.getAllSearchData(this.searchId);//查询condition
    if (searchVal) {
        let refreshdata = {
            "conditions": searchVal.conditions,
            "pagecode": this.pageId,
            "pageInfo": pageinfo,
            "queryAreaCode": this.searchId,
            "oid": "",
            "queryType": "simple"
        };
        ajax({
            url: '/nccloud/cmp/focussettleaccount/query.do',
            data: refreshdata,
            success: (res) => {
                let { success, data } = res; 
                if (success) {
                    if (data && data[this.tableId]) {
                        this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
                    } else {
                        toast(
							{
								color: 'warning',
								content: this.props.MutiInit.getIntl("36070FSA") &&
									this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000022')/*国际化处理：未查询出符合条件的数据!*/
							});
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            },
            error: (res) => {//错误处理
                if (res && res.message) {
                    // toast({ color: 'warning', content: res.message });
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        });

        buttonUsability.call(this, this.props, '');//列表按钮显影性
    }
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/