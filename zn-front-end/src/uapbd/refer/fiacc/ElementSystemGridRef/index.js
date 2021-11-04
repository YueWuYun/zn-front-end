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
	refName: 'refer-000096',/* 国际化处理： 要素体系*/
	placeholder: 'refer-000096',/* 国际化处理： 要素体系*/
	refCode: 'uapbd.refer.fiacc.ElementSystemGridRef',
	queryGridUrl: '/nccloud/uapbd/fiacc/ElementSystemGridRef.do',
	isMultiSelectedEnabled: false,
	columnConfig: [{name: [ 'refer-000097', 'refer-000098' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 体系编码,体系名称*/
	isHasDisabledData: false
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65