/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refType: 'grid',
        refName: 'refer-0001', // 单据类型
        refcode: 'tmpub.refer.biltype.BillTypeGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/BillTypeGridRef.do',
        isMultiSelectedEnabled: false,        
        columnConfig:[{
            name: ['refer-0002', 'refer-0003'], // 交易类型编码、交易类型名称
            code: ['refcode', 'refname']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/