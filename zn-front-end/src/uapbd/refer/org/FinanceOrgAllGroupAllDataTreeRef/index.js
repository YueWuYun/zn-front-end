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

		refType: 'tree',
		refName: 'refer-000220',/* 国际化处理： 财务组织(所有集团)(所有)*/
		placeholder: 'refer-000220',/* 国际化处理： 财务组织(所有集团)(所有)*/
		rootNode: { refname: 'refer-000220', refpk: 'root' },/* 国际化处理： 财务组织(所有集团)(所有)*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		refCode: 'uapbd.refer.org.FinanceOrgAllGroupAllDataRefTree',
		queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgAllGroupAllDataRefTree.do',
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65