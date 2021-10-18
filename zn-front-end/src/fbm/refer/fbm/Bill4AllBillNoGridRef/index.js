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
        /* 国际化处理： 票据编号参照 */
        refName: 'refer-0012',
        refcode: 'nccloud.web.fbm.ref.fbm.Bill4AllBillNoGridRef',
        queryGridUrl: '/nccloud/fbm/refer/Bill4AllBillNoGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '票据号', '币种','票据金额','到期日期','票据业务形态','所属组织' */
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0015' ], 
            code: ['fbmbillno', 'currname', 'money', 'enddate' ]
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/