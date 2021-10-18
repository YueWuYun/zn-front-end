/*/tXMJfyA3UuVWHA5rS3Wj+4OhiDxvRmagjwvacmElBa2vQUYMiVNGqu5jn49rEVp*/
import { ajax, cardCache, cacheTools, toast } from 'nc-lightapp-front';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { pageCodeCard ,base_url} from '../../cons/constant';

/**
 * 凭证联查单据
 * @param {*} props 
 */
export const voucherLinkBill = function (props, pageCode, tableId) {
    let checkedData = [];
    checkedData = cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: base_url+"voucherlinkbill.do",
            data: {
                operatingLogVO: checkedData,
                pageCode: pageCode,
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        if(data[tableId].rows.length == 1){
                            let srcid = data[tableId].rows[0].values.pk_fixeddatewithdraw.value;
                            setTimeout(() => {
                                props.pushTo("/card", {
                                    status: "browse",
                                    scene: SCENE.LINK,
                                    id: srcid,
                                    pagecode: pageCodeCard, 
                                    autolink: "Y"
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