/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
let { dataSource, search_key, tableId, searchId, pageCodeList, moduleId, oid, Query_List_URL } = CONSTANTS;
//缓存相关
let { setDefData, getDefData } = cardCache;
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
                    if (data && data.table && data.table.rows && data.table.rows.length > 0 && data.table.allpks && data.table.allpks.length > 0) {
                        props.table.setAllTableData(tableId, data[tableId]);
                        toast({
                            color: 'success', 
                            content: props.MutiInit.getIntl("36300REC").get('36300REC-000013') + data.table.allpks.length + props.MutiInit.getIntl("36300REC").get('36300REC-000014')
                        });
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                        toast({ color: 'warning', content: props.MutiInit.getIntl("36300REC") && props.MutiInit.getIntl("36300REC").get('36300REC-000012') });
                    }
                }
            }
        });
    }

};
/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/