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
		refName: 'refer-000080',/* 国际化处理： 会计年度*/
		placeholder: 'refer-000080',/* 国际化处理： 会计年度*/
		rootNode: { refname: 'refer-000080', refpk: 'root' },/* 国际化处理： 会计年度*/
		refCode: 'uapbd.refer.pubinfo.AccperiodYearTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/pub/AccPeriodSchemeDefaultTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/pub/AccperiodYearGridRef.do',
		columnConfig: [
			{
				name: [ 'refer-000436', 'refer-000437','refer-000438' ],/* 国际化处理： 年度,开始,结束*/
				code: [ 'periodyear', 'begindate','enddate' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65