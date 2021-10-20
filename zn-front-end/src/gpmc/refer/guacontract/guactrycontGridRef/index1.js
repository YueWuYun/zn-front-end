/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        refType: 'grid',
        refName: '担保合同',
        isCacheable: false,
        refcode: 'gpmc.refer.guacontract.guactrycontGridRef',
        queryGridUrl: '/nccloud/gpmc/refer/guactrycontGridRef.do',
        columnConfig:[{
            name: ['合同号', '单据编号', '可用金额'],
            code: ['contractno', 'vbillno', 'avaamount']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/