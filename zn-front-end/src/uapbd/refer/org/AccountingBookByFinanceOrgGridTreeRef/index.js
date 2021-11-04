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
	refName: 'refer-000170',/* 国际化处理： 财务核算账簿（财务组织）参照*/
	placeholder: 'refer-000171',/* 国际化处理： 财务核算账簿（财务组织）*/
	treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
	rootNode: { refname: 'refer-000171', refpk: 'root' },/* 国际化处理： 财务核算账簿（财务组织）*/
	refCode:'uapbd.ref.liabilitybooktreeref',
	queryTreeUrl: '/nccloud/uapbd/ref/accountingbooktreeref.do',
	queryGridUrl: '/nccloud/uapbd/ref/accountingbookgridref.do',
	isMultiSelectedEnabled: false,
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65