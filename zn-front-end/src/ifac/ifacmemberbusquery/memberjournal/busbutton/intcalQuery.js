/*/kB59XIB1xUtC0CdCjRD6188n04oQyH5gf5umYT69CfRsm/Yp0kFR5oEUNfIab+m*/
import { createPage, ajax, base, toast,high,cardCache ,getMultiLang, createPageIcon} from 'nc-lightapp-front';
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId } = cardCache;
import {processFormulamsg} from '../util/util.js';
import {   dataSourceTam ,card_table_id,card_from_id,list_table_id,list_page_id,card_page_id} from '../cons/constant.js';
import {requesturl} from '../cons/requesturl.js';
export const queryCard = function(props){
    
    let that = this;

    let id = this.props.getUrlParam('id');

    let scene = this.props.getUrlParam('scene');

    if(id&&scene&&scene==='linksce'){
        let data = {
            "pks": [id],
            "pageCode": list_page_id
        };
        ajax({
            url: requesturl.querybydepositcode,
            data: data,
            success: function (res) {
            that.props.table.setAllTableData(list_table_id, res.data[list_table_id]);
        }
        });
    }
}
/*/kB59XIB1xUtC0CdCjRD6188n04oQyH5gf5umYT69CfRsm/Yp0kFR5oEUNfIab+m*/