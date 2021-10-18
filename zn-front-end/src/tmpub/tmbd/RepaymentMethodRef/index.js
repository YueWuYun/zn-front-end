/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function( props = {} ) {
    let conf = {
        refName: '还款方式',
        refcode: 'tmpub.refer.tmbd.RepaymentMethodRef',
        queryGridUrl: '/nccloud/tmpub/refer/repaymentmethodgridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['编码', '还款方式名称', '还本方式', '还本日', '还本开始月', '还本周期','付息方式', '付息日', '付息开始月', '付息周期'], 
            code: ['code', 'name', 'repay_prcpl_method', 'repay_prcpl_date', 'startrepprcplmth', 'repay_prcpl_period', 'repay_intst_method', 'repay_intst_date', 'startrepintstmth', 'repay_intst_period']
        }]
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/