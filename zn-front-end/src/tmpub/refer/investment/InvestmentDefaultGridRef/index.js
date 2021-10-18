/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import { high } from 'nc-lightapp-front';
import "./index.less"
const { Refer } = high;

export default function( props = {} ) {
    var conf = {
        multiLang: {
            domainName: 'tmpub',
            currentLocales: 'zh-CN',
            moduleId: 'tmpubRefer'
        },
        refType:'grid',
        refName:'refer-0004',
        refCode:'tmpub.refer.investment.InvestmentDefaultGridRef',
        queryGridUrl:'/nccloud/tmpub/refer/ifvGridRef.do',
        isMultiSelectedEnabled:false,
        columnConfig:[{name:['refer-0005','refer-0006','refer-0007','refer-0008'],
        code:['refcode','type','variety_category','variety_name']}],
        popWindowClassName: 'investmentRef'
    }
    return <Refer { ...Object.assign(conf,props)}/>
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/