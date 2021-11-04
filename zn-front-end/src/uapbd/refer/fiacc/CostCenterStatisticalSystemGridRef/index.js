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
		refName: 'refer-003575',/* 国际化处理： 成本中心统计体系*/
		placeholder: 'refer-003575',/* 国际化处理： 成本中心统计体系*/
		refCode: 'uapbd.fiacc.CostCenterStatisticalSystemGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/CostCenterStatisticalSystemGridRef.do',
        columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'code', 'name' ]}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65