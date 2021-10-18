/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
//缓存相关
let { setDefData, getDefData } = cardCache;
let { dataSource, search_key, tableId, searchId, pageCodeList, moduleId, oid, Query_List_URL } = CONSTANTS;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    let oid = oid;
    if (props.meta.getMeta()[searchId].oid) {
        oid = props.meta.getMeta()[searchId].oid;//动态获取oid
    }
    if (searchVal) {
        // 将所有查询条件赋值进缓存
        setDefData(search_key, dataSource, searchVal);
        // 获取查询条件
        let pageInfo = props.table.getTablePageInfo(tableId);
        let searchArea = this.props.search.getAllSearchData(searchId);
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
            url: Query_List_URL,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(tableId, data[tableId]);
                        toast({ color: 'success' ,
                        content: this.props.MutiInit.getIntl("36300REC").get('36300REC-000013') + data.table.allpks.length +  this.props.MutiInit.getIntl("36300REC").get('36300REC-000014')
                    });
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300REC") && this.props.MutiInit.getIntl("36300REC").get('36300REC-000012') });
                    }
                }

            }
        });
    }

};
/*YuO8szH0cVixePu/Bt+mG2vIVUnwk/tT4MmcGFJYIabiXcuyg4D1EKN8eR5q0uAH*/