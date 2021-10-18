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
        refName: 'refer-0022',
        refcode: 'tmpub.refer.tmbd.MergeBankAccGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/nonbankaccgridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['refer-0010', 'refer-0005', 'refer-0023', 'refer-0024', 'refer-0025', 'refer-0026', 'refer-0027'], 
            code: ['name', 'code' ,'pk_bankdoc', 'pk_banktype', 'pk_currtype', 'contactpsn', 'tel']
        }],
        popWindowClassName: 'nonbankAccRef'
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/