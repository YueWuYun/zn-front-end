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
		refName: 'refer-000072',/* 国际化处理： 会计科目带科目表过滤参照*/
		placeholder: 'refer-000072',/* 国际化处理： 会计科目带科目表过滤参照*/
		refCode: 'uapbd.refer.fiacc.AccountInOrgGridTreeRef',
		queryTreeUrl: '/nccloud/uapbd/fiacc/AccountInOrgTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/fiacc/AccountInOrgGridRef.do',
		// columnConfig: [
		// 	{
		// 		name: [ '年度', '开始','结束' ],
		// 		code: [ 'periodyear', 'begindate','enddate' ]
		// 	}
		// ],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65