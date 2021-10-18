/*/tXMJfyA3UuVWHA5rS3Wj0QoKZD1S5tzMoD2pWNDtOvKlMGuYrzzIyCzxwVOegI3*/
import { ajax, cardCache, cacheTools, toast } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";

/**
 * 凭证联查单据
 * @param {*} props 
 */
export const voucherLinkBill = function (props, pageCode, tableId) {
    let checkedData = [];
    checkedData = cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: requesturl.voucherlinkbill,
            data: {
                operatingLogVO: checkedData,
                pageCode: pageCode,
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        cardCache.setDefData(constant.fipscene_key, constant.cacheDataSource, true);
                        if(data[tableId].rows.length == 1){
                            let srcid = data[tableId].rows[0].values.pk_accountagiotage.value;
                            setTimeout(() => {
                                props.pushTo('/card', {
                                    status: 'browse',
                                    scene: SCENE.LINK,
                                    id: srcid,
                                    // pk_accountagiotage: srcid,
                                    pagecode: constant.cpagecode2,
                                    autolink: "Y"
                                });
                            }, 10);
                        }else{
                            if (data) {
                                props.table.setAllTableData(tableId, data[tableId]);
                            } else {
                                props.table.setAllTableData(tableId, { rows: [] });
                            }
                            this.setState({});
                        }
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }
};
/*/tXMJfyA3UuVWHA5rS3Wj0QoKZD1S5tzMoD2pWNDtOvKlMGuYrzzIyCzxwVOegI3*/