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
        /* 国际化处理： 开票申请参照 */
        refName: 'refer-0030',
        refcode: 'nccloud.web.fbm.ref.cfbm.Bill4SignAcceptRef',
        queryGridUrl: '/nccloud/cfbm/refer/Bill4SignAcceptRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： 单据编号、申请组织、币种 */
            name: ['refer-0028', 'refer-0029','refer-0013'], 
            code: ['vbillno', 'pk_applyorg', 'pk_currtype' ]
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/