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

		refType: 'gridTree',
		refName: 'refer-000079',/* 国际化处理： 会计季度*/
		placeholder: 'refer-000079',/* 国际化处理： 会计季度*/
		refCode: 'uapbd.refer.fiacc.AccperiodQuarterGridTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/AccperiodQuarterTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/AccperiodQuarterGridRef.do',
		columnConfig: [{
			name: ['refer-000080', 'refer-000079', 'refer-000076', 'refer-000077']
			, code: ['refcode', 'refname', 'beginmonth', "endmonth"]
		}],/* 国际化处理： 会计季度,开始月,结束月*/
		rootNode: { refname: 'refer-000080', refpk: 'root' },/* 国际化处理： 会计年度*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65