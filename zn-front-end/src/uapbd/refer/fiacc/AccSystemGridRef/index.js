//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;
export var conf = {
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
        refName: 'refer-000081',/* 国际化处理： 科目体系*/
        placeholder: 'refer-000081',/* 国际化处理： 科目体系*/
        refCode: 'uapbd.refer.fiacc.AccSystemGridRef',
        queryGridUrl: '/nccloud/uapbd/fiacc/AccSystemGridRef.do',
        columnConfig: [{
                name: ['refer-000082', 'refer-000083']/* 国际化处理： 科目体系编码,科目体系名称*/
                , code: ['refcode', 'refname']
        }],
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
};
export default function (props = {}) {
        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65