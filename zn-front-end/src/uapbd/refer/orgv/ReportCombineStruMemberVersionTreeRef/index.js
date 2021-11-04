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
        refName: 'refer-000341',/* 国际化处理： 报表合并体系成员多版本*/
        placeholder: 'refer-000341',/* 国际化处理： 报表合并体系成员多版本*/
        rootNode: { refname: 'refer-000341', refpk: 'root' },/* 国际化处理： 报表合并体系成员多版本*/
        refCode: 'uapbd.refer.orgv.ReportCombineStruMemberVersionTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/ReportCombineStruMemberVersionTreeRef.do',
        treeConfig: {name: [ 'refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']},/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65