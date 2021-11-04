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
		refName: 'refer-000486',/* 国际化处理： 现金折扣方案*/
		placeholder: 'refer-000486',/* 国际化处理： 现金折扣方案*/
		refCode: 'uapbd.refer.sminfo.RateSchemaDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/sminfo/RateSchemaDefaultGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000487', 'refer-000488' ],code: ['refcode', 'refname' ]}],/* 国际化处理： 现金折扣方案编码,现金折扣方案名称*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65