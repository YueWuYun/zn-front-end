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
		refName: 'refer-000426',/* 国际化处理： 工作日历规则*/
		placeholder: 'refer-000426',/* 国际化处理： 工作日历规则*/
		refCode: 'uapbd.ref.WorkCalendarRuleDefaultGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/WorkCalendarRuleDefaultGridRef.do',
        columnConfig: [{name: [ 'refer-000427', 'refer-000428' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 工作日历规则编码,工作日历规则名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65