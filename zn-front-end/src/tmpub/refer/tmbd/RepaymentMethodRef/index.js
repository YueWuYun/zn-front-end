/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
import "./index.less"
const { Refer } = high;

export default function( props = {} ) {
    let conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refName: 'refer-0035',
        refcode: 'tmpub.refer.tmbd.RepaymentMethodRef',
        queryGridUrl: '/nccloud/tmpub/refer/repaymentmethodgridref.do',
        refType: 'grid',
        columnConfig: [{
            name: ['refer-0005', 'refer-0036', 'refer-0037', 'refer-0048', 'refer-0049', 'refer-0038','refer-0039', 'refer-0050', 'refer-0051', 'refer-0040'], 
            code: ['code', 'name', 'repay_prcpl_method', 'repay_prcpl_date', 'startrepprcplmth', 'repay_prcpl_period', 'repay_intst_method', 'repay_intst_date', 'startrepintstmth', 'repay_intst_period']
        }],
        placeholder: '搜索还款方式',
        popWindowClassName: 'repayMethodRef'
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/