//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	debugger;
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-003563',/* 国际化处理： 生产计划体系成员*/
        placeholder: 'refer-003563',/* 国际化处理： 生产计划体系成员*/
		refCode: 'uapbd.refer.org.ProductionPlanStruMemberTreeRef',
		rootNode: { refname: 'refer-003563', refpk: 'root' },/* 国际化处理： 生产计划体系成员*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		queryTreeUrl: '/nccloud/uapbd/org/ProductionPlanStruMemberTreeRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65