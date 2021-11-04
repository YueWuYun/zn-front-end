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
	refName: 'refer-000434',/* 国际化处理： 会计期间方案*/
	placeholder: 'refer-000434',/* 国际化处理： 会计期间方案*/
	refCode: 'uapbd.refer.pubinfo.AccPeriodSchemeDefaultTreeRef',
	queryGridUrl: '/nccloud/uapbd/pub/AccPeriodSchemeDefaultTreeRef.do',
	columnConfig: [
		{
			name: ['refer-000002', 'refer-000003'],/* 国际化处理： 编码,名称*/
			code: ['refcode', 'refname']
		}
	],
	isMultiSelectedEnabled: false,
	isHasDisabledData: false
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65