//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000282',/* 国际化处理： 报表组织*/
		placeholder:'refer-000282',/* 国际化处理： 报表组织*/
		refCode: 'uapbd.org.ReportOrgDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/ReportOrgDefaultGridRef.do',
		columnConfig: [{name: ['refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		isShowUnit: false,
		unitProps: unitConf
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65