//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';

export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'tree',
	refName: 'refer-000040',/* 国际化处理： 客户基本分类*/
	refCode: 'uapbd.customer.CustClassDefaultTreeRef',
	placeholder: 'refer-000040',/* 国际化处理： 客户基本分类*/
	rootNode: { refname: 'refer-000040', refpk: 'root' },/* 国际化处理： 客户基本分类*/
	queryTreeUrl: '/nccloud/uapbd/ref/CustClassDefaultTreeRef.do',
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	unitProps: unitConf
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65