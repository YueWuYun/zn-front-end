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
        refName: 'refer-000302',/* 国际化处理： 账簿合并体系成员多版本*/
        rootNode:{refname:'refer-000302',refpk:'root'},/* 国际化处理： 账簿合并体系成员多版本*/
        placeholder: 'refer-000302',/* 国际化处理： 账簿合并体系成员多版本*/
        refCode: 'uapbd.orgv.BookCombineStruMemberVersionTreeRef',
        queryTreeUrl: '/nccloud/uapbd/org/BookCombineStruMemberVersionTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65