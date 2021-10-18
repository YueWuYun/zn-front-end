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
        /* 国际化处理： 背书票据编号参照 */
        refName: 'refer-0012',
        refcode: 'nccloud.web.fbm.ref.fbm.Bill4BSPayBillNoGridRef',
        queryGridUrl: '/nccloud/fbm/refer/Bill4BSPayBillNoGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '票据号', '币种','票据金额','到期日期','票据类型'*/
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0015','refer-0024' ], 
            code: ['fbmbillno', 'currname', 'money', 'enddate','billtypename']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/