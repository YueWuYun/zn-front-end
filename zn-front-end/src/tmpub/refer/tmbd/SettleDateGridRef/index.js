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
        refName: 'refer-0041',
        refcode: 'tmpub.refer.tmbd.SettleDateGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/settledategridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['refer-0005', 'refer-0042', 'refer-0043','refer-0044','refer-0045'], 
            code: ['code', 'settlename', 'settleway', 'settlecycle', 'cycleunit']
        }],
        popWindowClassName: 'settleDateRef'
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/