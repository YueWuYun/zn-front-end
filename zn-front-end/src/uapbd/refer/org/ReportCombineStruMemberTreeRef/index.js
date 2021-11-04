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
		refName: 'refer-000277',/* 国际化处理： 报表合并体系成员*/
        placeholder: 'refer-000277',/* 国际化处理： 报表合并体系成员*/
        rootNode: { refname: 'refer-000277', refpk: 'root' },/* 国际化处理： 报表合并体系成员*/
		refCode:'uapbd.refer.org.ReportCombineStruMemberTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/ReportCombineStruMemberTreeRef.do',
        treeConfig: {name: [ 'refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65