/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function( props = {} ) {
    let conf = {
        refName: '还款方式',
        refcode: 'tmpub.refer.tmbd.SettleDateGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/settledategridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['编码', '结息日名称', '结息方式','结息周期','结息单位'], 
            code: ['code', 'settlename', 'settleway', 'settlecycle', 'cycleunit']
        }]
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/