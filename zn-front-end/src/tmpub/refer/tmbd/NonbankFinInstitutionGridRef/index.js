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
        refName: 'refer-0028',
        refcode: 'tmpub.refer.tmbd.NonbankFinInstitutionGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/nonbankfininstitutiongridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['refer-0029', 'refer-0030', 'refer-0031','refer-0032','refer-0033'], 
            code: ['code', 'name', 'type', 'province', 'city']
        }]
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/