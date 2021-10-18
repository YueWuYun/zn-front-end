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
        /* 国际化处理： 存单 */
        refName: 'refer-0038',
        refcode: 'ifac.refer.facdepositreceipt.DepositReceiptALLRef',
        queryGridUrl: '/nccloud/ifac/refer/FacDepositReceiptALLRef.do',
        isMultiSelectedEnabled: false,
        columnConfig:[{
            /* 国际化处理： '存单号', '存单余额,'存款日期','到期日期','转存类型','存款单位','定期账户','币种' */
            name: ['refer-0029', 'refer-0030','refer-0031','refer-0032','refer-0033','refer-0046','refer-0035','refer-0036' ], //,'refer-0017'
            code: ['depositcode', 'depostbalmnt', 'depositdate', 'enddate', 'redeposittype','pk_depositbank','pk_depositacc','pk_currtype'] //, 'destroyflag'
        }]
    };
    return <Refer {...Object.assign(conf, prop)} />
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/