/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        multiLang:{
            domainName:'fbm',
            currentLocale:'zh-CN',
            moduleId:'refer_fbm',
        },
        refType: 'grid',
        /* 国际化处理： 现金收款票据参照 */
        refName: 'refer-0021',
        refcode: 'fbm.refer.fbm.Bill4CmpReceiveGridRef',
        queryGridUrl: '/nccloud/fbm/refer/Bill4CmpReceiveGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '票据号', '币种','票据金额','到期日期','票据业务形态','所属组织' */
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0015','refer-0017','refer-0018' ],
            code: ['fbmbillno', 'currname', 'money', 'enddate', 'billtypename','orgname' ]
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/