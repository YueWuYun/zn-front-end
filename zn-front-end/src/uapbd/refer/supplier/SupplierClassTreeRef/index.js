//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

import { conf as unitConf } from '../../org/BusinessUnitAllTreeRef/index';

const { Refer } = high;

export  var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
	refName: 'refer-000507',/* 国际化处理： 供应商基本分类*/
	placeholder: 'refer-000507',/* 国际化处理： 供应商基本分类*/
	rootNode: { refname: 'refer-000507', refpk: 'root' },/* 国际化处理： 供应商基本分类*/
	refCode: 'uapbd.supplier.SupplierClassTreeRef',
	queryTreeUrl: '/nccloud/uapbd/ref/SupplierClassTreeRef.do',
	treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	unitProps: unitConf,
	isShowUnit:false
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65