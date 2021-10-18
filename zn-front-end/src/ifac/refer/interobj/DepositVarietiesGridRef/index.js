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
        /* 国际化处理： 内部定期品种设置 */
        refName: 'refer-0023',
        refcode: 'ifac.refer.interobj.DepositVarietiesGridRef',
                    
        queryGridUrl: '/nccloud/ifac/refer/DepositVarietiesGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '品种编号', '定期业务品种,'资金组织','币种','存款期间','期间单位' */
            name: ['refer-0022', 'refer-0023','refer-0024','refer-0025','refer-0026','refer-0027' ], //,'refer-0017'
            code: ['varcode', 'varname', 'pk_org', 'pk_currtype', 'depositperiod','periodunit'] //, 'destroyflag'
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/