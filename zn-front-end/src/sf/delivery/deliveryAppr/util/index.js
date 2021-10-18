/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
import { ajax } from 'nc-lightapp-front';

/**
 * 上收支付前校验
 * 
 */
export const payBeforeValidate = function (props, batchdata) {
    return new Promise(resolve => ajax({
        url: '/nccloud/sf/delivery/deliverypaybeforevalidate.do',
        data: batchdata,
        loading: false,
		async: false,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                resolve(data);
            }
        },
        error: res => resolve(null)
    }));
}

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/