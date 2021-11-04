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
		refName: 'refer-003576',/* 国际化处理： 利润中心成本域+财务成本域*/
		placeholder:'refer-003576',/* 国际化处理： 利润中心成本域+财务成本域*/
		refCode: 'uapbd.org.ProfitAndcostregionRef',
		queryGridUrl: '/nccloud/uapbd/ref/ProfitAndcostregionRef.do',
		columnConfig: [{name: ['refer-000002', 'refer-000003','refer-003577'],code: [ 'refcode', 'refname','type']}],/* 国际化处理： 编码,名称，成本域类型*/
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65