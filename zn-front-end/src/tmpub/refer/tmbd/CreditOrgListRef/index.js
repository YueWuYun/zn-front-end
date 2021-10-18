/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default  function( props = {} ) {
    let conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refType: 'grid',
        refName: 'refer-0021',
        refCode: 'tmpub.refer.tmbd.CreditOrgListRef',
        queryGridUrl: '/nccloud/tmpub/refer/CCTypeGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name : ['refer-0005', 'refer-0010'],code: ['refcode', 'refname']}]
    };

    return <Refer {...Object.assign(conf,props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/