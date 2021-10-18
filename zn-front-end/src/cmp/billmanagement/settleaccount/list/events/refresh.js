/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
/**
 * [结账]-[刷新]
 * @param {*} props 
 * @param {*} status 
 */
export const refresh = function () {

    let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);//分页
    let refreshsearchVal = this.props.search.getAllSearchData(this.searchId);//查询condition
    if (refreshsearchVal) {

        let refreshdata = {
            "conditions": refreshsearchVal.conditions,
            "pagecode": this.pageId,
            "pageInfo": refreshpageInfo,
            "queryAreaCode": this.searchId,
            "oid": "",
            "queryType": "simple"
        };
        ajax({
            url: '/nccloud/cmp/settleaccount/settleaccountquery.do',
            data: refreshdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data && data[this.tableId]) {

                        //待结账月份赋值
                        let rows = data[this.tableId].rows;
                        let isSettled = null;
                        rows.forEach((val) => {
                            
                            if (!isSettled) {
                                if (val.values.stype_flag.value == '2') {
                                    isSettled = val.values.stype_flag.value;//状态标识：1：未启用；2：未结账；3：已结账
                                    let title_month = (this.props.MutiInit.getIntl("36070SA") &&
                                        this.props.MutiInit.getIntl("36070SA").get('36070SA-000018')) + ' : ';
                                    this.setState({
                                        settleMonth: title_month + val.values.findAccMonth.value//待结账月份
                                    });
                                }
                            }
                        })

                        this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
                    } else {
                        if (data && data.message) {
                            toast({ color: 'warning', content: data.message });/* 国际化处理： 请选择单条数据，进行结账处理!*/
                        }else{
                            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") &&
                            this.props.MutiInit.getIntl("36070SA").get('36070SA-000019') });//未查询到符合条件的数据
                        }
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            }
        });
    }
};

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/