/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
let { setDefData } = cardCache;
import * as CONSTANTS from '../../const/constants';
let { dataSource, search_key, tableId, searchId, pageCodeList, Query_URL } = CONSTANTS;

export default function clickSearchBtn(props, searchVal) {
    let oid = '';
    if (props.meta.getMeta()[searchId].oid) {
        oid = props.meta.getMeta()[searchId].oid;//动态获取oid
    }
    if (searchVal) {
        // 将所有查询条件赋值进缓存
        setDefData(search_key, dataSource, searchVal);
        // 获取查询条件
        let pageInfo = props.table.getTablePageInfo(tableId);
        let data = {
            querycondition: searchVal,
            conditions: searchVal,
            pageInfo: pageInfo,
            pageCode: pageCodeList,
            queryAreaCode: searchId,
            oid: oid,
            querytype: 'tree'
        };
        ajax({
            url: Query_URL,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data.grid.table.rows.length > 0) {
                        this.props.table.setAllTableData(tableId, data.grid[tableId]);
                        toast({
                            duration: 3,
                            //title: this.props.MutiInit.getIntl("36362IWI") && this.props.MutiInit.getIntl("36362IWI").get('36362IWI-000028')+data.grid[tableId].pageInfo.total+this.props.MutiInit.getIntl("36362IWI") && this.props.MutiInit.getIntl("36362IWI").get('36362IWI-000029')/**国际化处理：查询成功 */,
                            title: this.state.json['36362IWI-000028']+data.grid[tableId].pageInfo.total+this.state.json['36362IWI-000029'],
                            color: 'success'
                        })
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                        toast({
                             color: 'warning', 
                             //content: this.props.MutiInit.getIntl("36362IWI") && this.props.MutiInit.getIntl("36362IWI").get('36362IWI-000025') 
                             content: this.state.json['36362IWI-000025']
                        });
                    }
                }

            }
        });
    }

};
/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/