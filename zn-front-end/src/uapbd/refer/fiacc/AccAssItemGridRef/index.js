//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = {
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
        
		refType: 'grid',
        refName: 'refer-000057',/* 国际化处理： 会计辅助核算项目*/
        placeholder: 'refer-000057',/* 国际化处理： 会计辅助核算项目*/
        refCode: 'uapbd.refer.fiacc.AccAssItemGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/AccAssItemGridRef.do',
        columnConfig: [{name: [ 'refer-000058', 'refer-000059' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 辅助核算项编码,辅助核算项名称*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65