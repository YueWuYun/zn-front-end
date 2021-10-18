/*/tXMJfyA3UuVWHA5rS3Wj+4OhiDxvRmagjwvacmElBa2vQUYMiVNGqu5jn49rEVp*/
//引入轻量化api
import { ajax, cardCache, cacheTools, toast } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入常量定义
import { module_id, base_url, card_page_id, card_from_id,list_table_id } from "../cons/constant";
import {requesturl} from '../cons/requesturl.js';
import { SCENE } from "../../../../tmpub/pub/cons/constant";
import {  addCacheData, getDefData, setDefData } from '../../../../tmpub/pub/util/cache';

/**
 * 凭证联查单据
 * @param {*} props 
 */
export const voucherLinkBill = function (props, pageCode, tableId) {
    tableId = list_table_id;
    let checkedData = [];
    checkedData = cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: requesturl.belinkaction,
            data: {
                operatingLogVO: checkedData,
                pageCode: pageCode,
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        if(data[tableId].rows.length == 1){
                            let srcid = data[tableId].rows[0].values.pk_intlist.value;
                            setTimeout(() => {
                                props.pushTo('/card', {
                                    status: 'browse',
                                    scene: SCENE.LINK,
                                    id: srcid,
                                    islinkquery:false,
                                    pagecode: card_page_id,
                                    autolink: "Y"
                                });
                            }, 10);
                        }else{
                            if (data) {
                                props.table.setAllTableData('36340CDIR_L01_head', data[tableId]);
                            } else {
                                props.table.setAllTableData('36340CDIR_L01_head', { rows: [] });
                            }
                        }
                    } else {
                        props.table.setAllTableData('36340CDIR_L01_head', { rows: [] });
                    }
                }
            }
        });
    }
};
/*/tXMJfyA3UuVWHA5rS3Wj+4OhiDxvRmagjwvacmElBa2vQUYMiVNGqu5jn49rEVp*/