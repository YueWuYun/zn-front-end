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
	refName: 'refer-000165',/* 国际化处理： 财务组织*/
	placeholder: 'refer-000165',/* 国际化处理： 财务组织*/
	rootNode: { refname: 'refer-000165', refpk: 'root' },/* 国际化处理： 财务组织*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	refCode: 'uapbd.refer.org.FinanceOrgAndGroupTreeRef',
	queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgAndGroupTreeRef.do',
	isShowDisabledData: false,
	unitProps: unitConf,
	isRunWithChildren: false,
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65