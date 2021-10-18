/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/
import { ajax } from 'nc-lightapp-front';
import  { setButtonUsability }  from './index';

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';

export default function (props, config, pks) {
    //分页根据pks查询数据
    let data = {
        pks: pks,
        pageId: list_table_id
    };
    ajax({
        url: '/nccloud/tmpub/tmbd/accidqueryallpk.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data){
                    props.table.setAllTableData(list_table_id, data[list_table_id]);
                }else{
                    props.table.setAllTableData(list_table_id, {rows:[]});
                }
                setButtonUsability.call(this, props);
            }
        }
    }); 
}

/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/