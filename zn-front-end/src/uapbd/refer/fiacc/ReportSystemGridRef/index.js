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
		refName: 'refer-000118',/* 国际化处理： 报表项目体系*/
		placeholder: 'refer-000118',/* 国际化处理： 报表项目体系*/
		refCode: 'uapbd.fiacc.ReportSystemGridRef',	
        queryGridUrl: '/nccloud/uapbd/fiacc/ReportSystemGridRef.do',
        columnConfig: [{name: [ 'refer-000119', 'refer-000120', 'refer-000024' ],code: [ 'refcode', 'refname', 'remark']}],/* 国际化处理： 报表项目体系编码,报表项目体系名称,备注*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65