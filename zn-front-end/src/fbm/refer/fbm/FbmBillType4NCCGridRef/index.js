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
        /* 国际化处理： 票据单据类型参照 */
        refName: 'refer-0025',
        refcode: 'nccloud.web.fbm.ref.fbm.FbmBillType4NCCGridRef',
        queryGridUrl: '/nccloud/fbm/refer/FbmBillType4NCCGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '单据类型编码', '单据类型名称'*/
            name: ['refer-0026', 'refer-0027'], 
            code: ["pk_billtypecode","billtypename"]
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/