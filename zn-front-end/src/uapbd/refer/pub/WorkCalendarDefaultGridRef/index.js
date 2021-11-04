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
		refName: 'refer-000423',/* 国际化处理： 工作日历*/
		placeholder: 'refer-000423',/* 国际化处理： 工作日历*/
		refCode: 'uapbd.ref.WorkCalendarDefaultGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/WorkCalendarDefaultGridRef.do',
        columnConfig: [{name: [ 'refer-000424', 'refer-000425' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 工作日历编码,工作日历名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65