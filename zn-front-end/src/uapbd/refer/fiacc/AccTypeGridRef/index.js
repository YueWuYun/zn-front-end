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
                refName: 'refer-000084',/* 国际化处理： 科目类型*/
                placeholder: 'refer-000084',/* 国际化处理： 科目类型*/
                refCode: 'uapbd.refer.fiacc.AccTypeGridRef',
                queryGridUrl: '/nccloud/uapbd/fiacc/AccTypeGridRef.do',
                columnConfig: [{
                        name: ['refer-000085', 'refer-000086', 'refer-000087']/* 国际化处理： 类型编码,类型名称,所属科目体系*/
                        , code: ['ccode', 'refname', 'sysname']
                }],
                isMultiSelectedEnabled: false,
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65