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
		idKey:'refpk2',
		pidKey:'pid2',
		refType: 'tree',
		refName: 'refer-000226',/* 国际化处理： 财务组织-资金管控*/
		placeholder: 'refer-000226',/* 国际化处理： 财务组织-资金管控*/
		refCode: 'uapbd.refer.org.FundManaSystemMemberByFinancePKTreeRef',
		rootNode: { refname: 'refer-000226', refpk2: 'root' },/* 国际化处理： 财务组织-资金管控*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		queryTreeUrl: '/nccloud/uapbd/org/FundManaSystemMemberByFinancePKTreeRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65