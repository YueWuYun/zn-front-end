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
        refName: 'refer-0031',
        refcode: 'nccloud.web.fbm.ref.fbm.Bill4ApplyBillNoGridRef',
        queryGridUrl: '/nccloud/fbm/refer/Bill4ApplyBillNoGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '申请单编号', '票据编号','币种','票据金额'*/
            name: ['refer-0031', 'refer-0012','refer-0013','refer-0014'], 
            code: ['vbillno', 'fbmbillno', 'currname', 'money']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/