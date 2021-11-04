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
	refName: 'refer-000176',/* 国际化处理： 行政组织*/
	placeholder: 'refer-000176',/* 国际化处理： 行政组织*/
	refCode: 'uapbd.org.AdminOrgDefaultTreeRef',
	queryTreeUrl: '/nccloud/riaorg/ref/AdminOrgDefaultTreeRef.do',
	treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
	rootNode: { refname: 'refer-000176', refpk: 'root' },/* 国际化处理： 行政组织*/
	isMultiSelectedEnabled: false,
	unitProps: unitConf,
	isShowUnit:false
};

export default function (props = {}) {
	
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65