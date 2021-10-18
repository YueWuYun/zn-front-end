/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/
import {ajax, cardCache, toast} from 'nc-lightapp-front';

import clickBtn from './setButtonUsability';
let { setDefData, getDefData } = cardCache;

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
    card_page_id,card_from_id,card_fromtail_id,
    dataSource, cachesearchKey
} from '../../cons/constant.js';

//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {
    if(searchVal){  
        setDefData(cachesearchKey, dataSource, searchVal);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let queryInfo = props.search.getQueryInfo(list_search_id, false);
        let oid= queryInfo.oid;
        let data = {
            querycondition: searchVal,
            conditions: searchVal.conditions || searchVal,
            pageInfo: pageInfo,
            pagecode: list_page_id,
            //查询区编码
            queryAreaCode: list_search_id,
            //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
            oid: oid,
            querytype: 'tree',
        };
        ajax({
            url: '/nccloud/tmpub/tmbd/accidquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        toast({ color: 'success' });
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    } else {
                        /* 国际化处理： 未查询出符合条件的数据! */
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC")
                         && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000048') });
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                    }
                    clickBtn.call(this,this.props);
                }
            }
        });
    }    
};

/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/