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
                refName: 'refer-000397',/* 国际化处理： 贸易术语*/
                refCode: 'uapbd.refer.busiinfo.IncotermGridRef',
                placeholder: 'refer-000397',/* 国际化处理： 贸易术语*/
                queryGridUrl: '/nccloud/uapbd/ref/IncotermGridRef.do',
                isMultiSelectedEnabled: false,
                columnConfig: [{ name: ['refer-000398', 'refer-000003'], code: ['refcode', 'refname'] }],/* 国际化处理： 代码,名称*/
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65