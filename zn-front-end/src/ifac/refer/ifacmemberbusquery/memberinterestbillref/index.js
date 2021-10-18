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
        /* 国际化处理： 单位内部定期利息清单 */
        refName: 'refer-0040',
        refcode: 'ifac.refer.ifacmemberbusquery.memberinterestbillref',
        queryGridUrl: '/nccloud/ifac/refer/memberinterestbillref.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '清单编号', '财务组织,'资金组织','清单类型','存单号'*/
            name: ['refer-0041', 'refer-0042','refer-0043','refer-0044','refer-0045' ], //,'refer-0017'
            code: ['vbillcode', 'pk_org', 'pk_depositorg', 'billtype', 'depositcode'] //, 'destroyflag'
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/