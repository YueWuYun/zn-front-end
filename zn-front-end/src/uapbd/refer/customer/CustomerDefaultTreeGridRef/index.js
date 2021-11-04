//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';
unitConf["fieldid"] = "busiUnit"

export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'gridTree',
	refName: 'refer-000046',/* 国际化处理： 客户档案*/
	refCode: 'uapbd.customer.CustomerDefaultGridRef',
	placeholder: 'refer-000046',/* 国际化处理： 客户档案*/
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	rootNode: { refname: 'refer-000040', refpk: 'root' },/* 国际化处理： 客户基本分类*/
	queryTreeUrl: '/nccloud/uapbd/ref/CustClassDefaultTreeRef.do',
	queryGridUrl: '/nccloud/uapbd/ref/CustomerDefaultGridRef.do',
	columnConfig: [{
		name: ['refer-000047', 'refer-000048', 'refer-000049', 'refer-000014'],/* 国际化处理： 所属组织,客户编码,客户名称,助记码*/
		code: ['org_name', 'refcode', 'refname', 'mnecode'],
		fullTxtCode: { 'refcode': true, 'refname': true, 'mnecode': false },
		search: { 'mnecode': true }
	}],
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	unitProps: unitConf,
	isShowUsual: true,
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65