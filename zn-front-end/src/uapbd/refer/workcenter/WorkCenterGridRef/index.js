//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../org/FactoryGridRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000532',/* 国际化处理： 工作中心*/
		placeholder: 'refer-000532',/* 国际化处理： 工作中心*/
		refCode: 'uapbd.workcenter.WorkCenterGridRef',
		queryGridUrl: '/nccloud/uapbd/workcenter/WorkCenterGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['refer-000533', 'refer-000534'], code: ['refcode', 'refname'] }],/* 国际化处理： 工作中心编码,工作中心名称*/
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65