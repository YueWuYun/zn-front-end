/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 联查方法，需要使用call调用
 created by: liyaoh 2018-12-05
*/

import linkApproveDetail from './linkApproveDetail'; //联查审批详情
import linkInterest from './linkInterest'; //联查利率
import linkSettledate from './linkSettledate'; //联查结息日
import { linkVoucher, voucherLinkBill } from './linkVoucher'; //联查凭证、凭证反联查单据

export {
    linkApproveDetail,
    linkInterest,
    linkSettledate,
    linkVoucher,
    voucherLinkBill
}
/**
 * @param {*} props
 * @param {*} {
 *     url, 联查应用地址
 *     status = 'browse', 页面编辑状态，默认浏览态
 *     appcode, 小应用编码
 *     pagecode, 页面编码
 *     scene, 场景名称，默认联查
 *     id 被联查单据主键
 * }
 */
export function linkApp(props, {
    url,
    status = 'browse',
    appcode,
    pagecode,
    scene = 'linksce',
    id
}) {
    props.openTo(url, {
        status,
        appcode,
        pagecode,
        scene,
        id
    });
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/