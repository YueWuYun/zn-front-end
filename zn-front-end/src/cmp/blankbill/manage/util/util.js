/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/
//引入轻量化api
import { ajax, cardCache, cacheTools } from 'nc-lightapp-front';
import  { requesturl } from  '../config/config';
/**
 * 凭证联查单据
 * @param {*} props 
 */
export const VoucherLinkBill = function (props, pageCode, tableId) {
    let checkedData = [];
    checkedData = cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: requesturl.voucherlink,
            data: {
                operatingLogVO: checkedData,
                pageCode: pageCode,
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        if(data.model){
                            this.props.table.setAllTableData(tableId, data.model);
                        } else {
                            props.table.setAllTableData(tableId, { rows: [] });
                        }
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }
};
/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/