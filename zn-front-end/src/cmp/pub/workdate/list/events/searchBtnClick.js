/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import {ajax} from 'nc-lightapp-front';

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {
    let pk_org;
    if(searchVal){
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        if(props.search.getSearchValByField(this.searchId,"pk_org")){
            pk_org = props.search.getSearchValByField(this.searchId,"pk_org").value.firstvalue
        }
        let starter;
        if(props.search.getSearchValByField(this.searchId,"starter")){
            starter = props.search.getSearchValByField(this.searchId,"starter").value.firstvalue;
        }
        let data={
            pk_org: pk_org,
            starter: starter
        };
        ajax({
            url: '/nccloud/fts/workdate/querylog.do',
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