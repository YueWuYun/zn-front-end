//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../org/FinanceOrgTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000466',/* 国际化处理： 现金账户*/
		placeholder: 'refer-000466',/* 国际化处理： 现金账户*/
		refCode: 'uapbd.refer.sminfo.CashAccountGridRef',
		queryGridUrl: '/nccloud/uapbd/sminfo/CashAccountGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{
			name: ['refer-000002', 'refer-000003', 'refer-000384'],
			code: ['refcode', 'refname', 'currtype']
		}],/* 国际化处理： 编码,名称,币种*/
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65