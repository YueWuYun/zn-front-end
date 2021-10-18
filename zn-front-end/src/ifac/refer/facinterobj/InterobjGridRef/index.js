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
        /* 国际化处理： 内部账户计息设置 */
        refName: 'refer-0011',
        refcode: 'ifac.refer.facinterobj.InterobjGridRef',
        queryGridUrl: '/nccloud/ifac/refer/bankInterobjGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '对象编码', '对象名称,'对象类型','币种','停用标识','销户标识' */
            name: ['refer-0012', 'refer-0013','refer-0014','refer-0015','refer-0016' ], //,'refer-0017'
            code: ['objcode', 'intobjname', 'intmode', 'pk_currtype', 'useflag'] //, 'destroyflag'
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/