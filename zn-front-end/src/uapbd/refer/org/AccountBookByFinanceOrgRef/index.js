//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
	refName: 'refer-000166',/* 国际化处理： 财务核算账簿-财务组织*/
	placeholder: 'refer-000166',/* 国际化处理： 财务核算账簿-财务组织*/
	refCode: 'uapbd.ref.AccountBookByFinanceOrgTreeRef',

	queryTreeUrl: '/nccloud/uapbd/ref/AccountBookByFinanceOrgTreeRef.do',
	queryGridUrl: '/nccloud/uapbd/ref/AccountBookByFinanceOrgGridRef.do',
	isMultiSelectedEnabled: false,
	rootNode: { refname: 'refer-000165', refpk: 'root', isleaf: false },/* 国际化处理： 财务组织*/
	columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }]/* 国际化处理： 编码,名称*/
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65