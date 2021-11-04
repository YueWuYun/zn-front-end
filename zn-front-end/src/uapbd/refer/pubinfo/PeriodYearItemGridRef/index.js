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
		refName: 'refer-000451',/* 国际化处理： 会计年度列表*/
		placeholder: 'refer-000451',/* 国际化处理： 会计年度列表*/
		refCode: 'uapbd.refer.pubinfo.PeriodYearItemGridRef',
		queryGridUrl: '/nccloud/uapbd/pub/PeriodYearItemGridRef.do',
		columnConfig: [
			{
				name: [ 'refer-000451' ],/* 国际化处理： 会计年度列表*/
				code: [ 'periodyear' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65