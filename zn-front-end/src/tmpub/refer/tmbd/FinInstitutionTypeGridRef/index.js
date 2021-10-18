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
        refName: 'refer-0052',
        refcode: 'tmpub.refer.tmbd.FinInstitutionTypeGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/financialtypegridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['refer-0005', 'refer-0010'], 
            code: ['code', 'name']
        }],
        popWindowClassName: 'finInstitutionTypeRef'
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/