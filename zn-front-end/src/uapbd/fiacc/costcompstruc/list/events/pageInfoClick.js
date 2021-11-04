//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import {ajax} from 'nc-lightapp-front';
import {tableId} from '../constants';
/**
 * 列表分页查询
 */
export default function (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(tableId);
    let data = {
        "allpks": pks,
        "pagecode":  props.getSearchParam('p'), //页面id
        "pageInfo":pageInfo
    };
    ajax({
        url:'/nccloud/uapbd/costcompstruc/querypagelist.do',
        data: data,
        success: function (res) {
            let {success,data} = res;
            if(success)
            {
                if(data)
                {
                    props.table.setAllTableData(tableId, res.data[tableId]);
                }
                else
                {
                    props.table.setAllTableData(tableId, {rows:[]});
                }
            }
        }
    });
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1