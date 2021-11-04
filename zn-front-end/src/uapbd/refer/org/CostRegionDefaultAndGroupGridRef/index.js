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
		refName: 'refer-000211',/* 国际化处理： 财务成本域*/
		placeholder:'refer-000211',/* 国际化处理： 财务成本域*/
		refCode: 'uapbd.org.CostRegionDefaultAndGroupGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CostRegionDefaultAndGroupGridRef.do',
		columnConfig: [{name: ['refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65