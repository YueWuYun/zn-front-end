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
		refName: 'refer-000433',/* 国际化处理： 会计月份*/
		rootNode: { refname: 'refer-000080', refpk: 'root' },/* 国际化处理： 会计年度*/
		placeholder: 'refer-000433',/* 国际化处理： 会计月份*/
		refCode: 'uapbd.refer.pubinfo.AccperiodMonthTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/pub/AccperiodYearTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/pub/AccperiodMonthGridRef.do',
		columnConfig: [
			{
				name: [ 'refer-000430', 'refer-000431','refer-000432' ],/* 国际化处理： 月份,开始期间,结束期间*/
				code: [ 'refname', 'begindate','enddate' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65