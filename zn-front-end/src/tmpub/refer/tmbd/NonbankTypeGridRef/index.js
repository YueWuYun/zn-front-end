/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function( props = {} ) {
    let conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refName: 'refer-0034',
        refcode: 'tmpub.refer.tmbd.NonbankTypeGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/nonbanktypegridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['refer-0010', 'refer-0005'], 
            code: ['name', 'code']
        }]
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/