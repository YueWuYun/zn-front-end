//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000168',/* 国际化处理： 财务核算账簿(财务组织)(所有)参照*/
		placeholder: 'refer-000168',/* 国际化处理： 财务核算账簿(财务组织)(所有)参照*/
		rootNode: { refname: 'refer-000169', refpk: 'root' },/* 国际化处理： 财务核算账簿(财务组织)(所有)*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		refCode:'uapbd.ref.accountingbookbyfinanceorgalltreeref',
		queryTreeUrl: '/nccloud/uapbd/ref/accountingbookbyfinanceorgalltreeref.do',
		queryGridUrl: '/nccloud/uapbd/ref/accountingbookbyfinanceorgallgridref.do',
		columnConfig: [{name: [ 'refer-000002', 'refer-000003'  ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65