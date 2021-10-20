/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (prop = {}) {
    var conf = {
        refType: 'grid',
        refName: '担保物权',
        refcode: 'gpmc.refer.guaproperty.guapropGridRef',
        queryGridUrl: '/nccloud/gpmc/refer/guapropGridRef.do',
        isCacheable: false,
        columnConfig:[{
            name: ['单据编号', '物权名称', '物权分类', '可抵质押价值', '剩余可抵质押价值'],
            code: ['vbillno', 'propertyname', 'guagptype', 'maxpledge', 'restpledge']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/