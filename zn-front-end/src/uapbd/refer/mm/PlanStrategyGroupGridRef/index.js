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
		refName: 'refer-000162',/* 国际化处理： 计划策略组*/
		refCode: 'uapbd.ref.PlanStrategyGroupGridRef',
		placeholder:'refer-000162',/* 国际化处理： 计划策略组*/
		queryGridUrl: '/nccloud/uapbd/ref/PlanStrategyGroupGridRef.do',
		columnConfig: [{name: [ 'refer-000002', 'refer-000003'  ],code: [ 'refcode', 'refname'  ]}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65