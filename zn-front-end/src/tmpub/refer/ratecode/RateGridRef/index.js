/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
import "./index.less"
const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refType: 'grid',
        refName: 'refer-0011',
        refcode: 'tmpub.refer.ratecode.RateGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/RateGridRef.do',
        columnConfig:[{
            name: ['refer-0012', 'refer-0013', 'refer-0014','refer-0015','refer-0016','refer-0017','refer-0018','refer-0019','refer-0020' ], 
            code: ['rateid', 'ratename', 'r.revisedate', 'yrate', 'mrate', 'rate', 'ratetype','finance_rate_type','o.name' ]
        }],
        popWindowClassName: 'rateRef'
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/