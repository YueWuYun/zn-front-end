//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER',
		},

		refType: 'grid',
		refName: 'mpobjrefer-000001',
		placeholder: 'mpobjrefer-000001',
		refCode: 'uapbd.mpobj.MpobjSchemeGridRef',
		queryGridUrl: '/nccloud/mmbd/mpobj/schemeref.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['mpobjrefer-000002', 'mpobjrefer-000003'], code: ['refcode', 'refname'] }],
		isShowUnit: false,
		unitValueIsNeeded: false,
	};
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65