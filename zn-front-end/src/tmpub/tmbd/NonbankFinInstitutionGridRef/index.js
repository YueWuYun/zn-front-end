/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function( props = {} ) {
    let conf = {
        refName: '非银行金融机构',
        refcode: 'tmpub.refer.tmbd.NonbankFinInstitutionGridRef',
        queryGridUrl: '/nccloud/tmpub/refer/nonbankfininstitutiongridref.do',
        refType: 'grid',
        columnConfig:[{
            name: ['金融机构编码', '金融机构名称', '机构类别','省','市'], 
            code: ['code', 'name', 'type', 'province', 'city']
        }]
    };
    return <Refer {...Object.assign(conf, props)} />
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/