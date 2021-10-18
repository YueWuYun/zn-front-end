/*5XvtupHWz8hgZkhnuCN//kLzMPohCtyQ+Buxcf9N+TPXrzsZ/nPV32Oj1xbBVR4D*/
import { ajax } from 'nc-lightapp-front';
/**
 * 修改数据权限过滤
 */
export const checkEditRight = function (id) {

    return new Promise((resolve) => {
        let data = {
            status: 'edit',
            billtypecode: '36S5',
            pk: id
        }
        ajax({
            url: '/nccloud/cmp/pub/checkedit.do',
            data: { extParam: data },
            success: (res) => {
                //console.log('u got it!!!');
                resolve(res);
            }
        });

    });
}

/*5XvtupHWz8hgZkhnuCN//kLzMPohCtyQ+Buxcf9N+TPXrzsZ/nPV32Oj1xbBVR4D*/