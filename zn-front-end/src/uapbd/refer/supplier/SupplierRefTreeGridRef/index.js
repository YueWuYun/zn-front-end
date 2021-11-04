//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';

const { Refer } = high;

export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'gridTree',
	refName: 'refer-000513',/* 国际化处理： 供应商档案*/
	placeholder: 'refer-000513',/* 国际化处理： 供应商档案*/
	refCode: 'uapbd.supplier.SupplierGridTreeRef',
	rootNode: { refname: 'refer-000507', refpk: 'root' },/* 国际化处理： 供应商基本分类*/
	queryTreeUrl: '/nccloud/uapbd/ref/SupplierClassTreeRef.do',
	queryGridUrl: '/nccloud/uapbd/ref/SupplierGridRef.do',
	treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	columnConfig: [{
		name: ['refer-000047', 'refer-000514', 'refer-000515', 'refer-000014', 'refer-000516']/* 国际化处理： 所属组织,供应商编码,供应商名称,助记码,供应商简称*/
		, code: ['pk_orgname', 'refcode', 'refname', 'mnecode', 'shortname'],
		fullTxtCode: { 'refcode': true, 'refname': true, 'mnecode': false, 'shortname': false },
		checked: { shortname: false },
		search: { 'mnecode': true }
	}],
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	isShowUnit: false,
	unitProps: unitConf,
	isShowUsual: true,
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65