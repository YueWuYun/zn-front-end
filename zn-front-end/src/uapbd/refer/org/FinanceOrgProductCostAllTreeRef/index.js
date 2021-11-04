//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';

const { Refer } = high;

export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000222',/* 国际化处理： 财务组织(所有,项目成本启用)*/
	placeholder: 'refer-000222',/* 国际化处理： 财务组织(所有,项目成本启用)*/
	rootNode: { refname: 'refer-000222', refpk: 'root' },/* 国际化处理： 财务组织(所有,项目成本启用)*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	refCode: 'uapbd.refer.org.FinanceOrgProductCostAllTreeRef',
	queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgProductCostAllTreeRef.do',
	isShowDisabledData: true,
	unitProps: unitConf,
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65