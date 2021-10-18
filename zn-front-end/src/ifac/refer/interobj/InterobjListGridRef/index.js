/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        multiLang:{
            domainName:'ifac',
            currentLocale:'zh-CN',
            moduleId:'refer_ifac',
        },
        refType: 'grid',
        /* 国际化处理： 账户对象计息 */
        refName: 'refer-0010',
        refcode: 'ifac.refer.interobj.InterobjGridRef',
        queryGridUrl: '/nccloud/ifac/refer/InterobjListGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '对象编码', '对象名称,'对象类型','停用标识','销户标识' */
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0016','refer-0017' ], 
            code: ['objcode', 'intobjname', 'intmode',  'useflag', 'destroyflag']
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/