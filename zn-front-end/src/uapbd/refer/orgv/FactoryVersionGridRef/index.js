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
		refName: 'refer-003557',/* 国际化处理： 工厂版本*/
		placeholder: 'refer-003557',/* 国际化处理： 工厂版本*/
		refCode: 'uapbd.refer.orgv.FactoryVersionGridRef',
		queryGridUrl: '/nccloud/uapbd/orgv/FactoryVersionGridRef.do',
		columnConfig: [{ name: ['refer-000002', 'refer-000251'], code: ['refcode', 'refname'] }],/* 国际化处理： 编码,版本名称*/
		unitProps: unitConf,
		isHasDisabledData: false,
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65