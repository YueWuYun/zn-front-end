/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default  function( props = {} ) {
    let conf = {
        refType: 'grid',
        refName: '授信类别',
        refCode: 'tmpub.refer.tmbd.CreditOrgListRef',
        queryGridUrl: '/nccloud/tmpub/refer/CCTypeGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{name : ['编码', '名称'],code: ['refcode', 'refname']}]
    };

    return <Refer {...Object.assign(conf,props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/