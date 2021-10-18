/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import {ajax} from 'nc-lightapp-front';

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode, oid 
} from '../../cons/constant.js';

//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {
    if(searchVal){
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let data={
            conditions: searchVal.conditions || searchVal,
            pageInfo: pageInfo,
            pagecode: list_page_id,
            //查询区编码
            queryAreaCode: list_search_id,
            //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            oid: oid,
            queryType: 'simple'
        };
        ajax({
            url: '/nccloud/fts/workdatequery/querydetail.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data){
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    }else{
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                }
            }
        });
    }
};
/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/