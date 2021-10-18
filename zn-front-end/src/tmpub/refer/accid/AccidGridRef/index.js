/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        multiLang:{
            domainName:'tmpub',
            currentLocale:'zh-CN',
            moduleId:'refer_tmpub',
        },
        refType: 'grid',
        /* 国际化处理： 内部账户档案 */
        refName: 'refer-0011',
        refcode: 'tmpub.refer.accid.AccidGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/AccidGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '账号', '账户说明','开户单位','开户银行','币种','账户类型','是否清算账户' */
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0015','refer-0016','refer-0017','refer-0018' ], 
            code: ['refcode', 'refname', 'pk_ownerorgname', 'pk_orgname', 'currtypename','acctypename','isaccounting' ]
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/