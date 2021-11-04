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
		refName: 'refer-000214',/* 国际化处理： 数据源*/
		placeholder:'refer-000214',/* 国际化处理： 数据源*/
		refCode: 'uapbd.refer.org.DataSourceDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/org/DataSourceDefaultGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: ['refer-000214'],code: ['name']}],/* 国际化处理： 数据源*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65