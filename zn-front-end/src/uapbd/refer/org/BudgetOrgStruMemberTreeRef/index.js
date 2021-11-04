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
        refName: 'refer-000190',/* 国际化处理： 预算组织体系成员*/
        refCode: 'uapbd.refer.org.BudgetOrgStruMemberTreeRef',
        placeholder: 'refer-000190',/* 国际化处理： 预算组织体系成员*/
        rootNode:{refname:'refer-000190',refpk:'root'},/* 国际化处理： 预算组织体系成员*/
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        queryTreeUrl: '/nccloud/uapbd/ref/BudgetOrgStruMemberTreeRef.do',
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65