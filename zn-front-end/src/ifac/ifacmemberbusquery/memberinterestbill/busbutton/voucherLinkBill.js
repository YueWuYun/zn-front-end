/*/tXMJfyA3UuVWHA5rS3Wj+4OhiDxvRmagjwvacmElBa2vQUYMiVNGqu5jn49rEVp*/
//引入轻量化api
import { ajax, cardCache, cacheTools, toast } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入常量定义
import { module_id, base_url, card_page_id, card_from_id } from "../cons/constant";
import {requesturl} from '../cons/requesturl.js';
import { SCENE } from "../../../../tmpub/pub/cons/constant";
import {  addCacheData, getDefData, setDefData } from '../../../../tmpub/pub/util/cache';

/**
 * 凭证联查单据
 * @param {*} props 
 */
export const voucherLinkBill = function (props, pageCode, tableId) {
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
                            let srcid = data[tableId].rows[0].values.pk_interest.value;
                            setTimeout(() => {
                                props.pushTo('/card', {
                                    status: 'browse',
                                    scene: SCENE.LINK,
                                    id: srcid,
                                    pagecode: card_page_id,
                                    autolink: "Y",
                                    src:"fip"
                                });
                            }, 10);
                        }else{
                            if (data) {
                                props.table.setAllTableData(tableId, data[tableId]);
                            } else {
                                props.table.setAllTableData(tableId, { rows: [] });
                            }
                        }
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }
};
/*/tXMJfyA3UuVWHA5rS3Wj+4OhiDxvRmagjwvacmElBa2vQUYMiVNGqu5jn49rEVp*/